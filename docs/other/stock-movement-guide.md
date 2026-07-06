# Stock & Stock Movement: The Core Inventory Engine

In a Manufacturing Execution System (MES) or ERP, inventory tracking relies on an **Event Sourcing** (or Ledger) pattern. This means we never simply overwrite a number in a database when inventory changes. Instead, we record every physical movement and calculate the current state from those movements.

This is handled by two tables working hand-in-hand: **`StockMovement`** (The Ledger) and **`Stock`** (The Current Balance).

---

## 1. Core Concepts

### `StockMovement` (The Ledger)
This table acts like a bank account transaction history. It is an immutable, append-only ledger. Every time a physical item enters, leaves, or moves within your facility, a brand new row is inserted here. 

### `Stock` (The Current Balance)
This table acts like the bold "Current Balance" at the top of your bank statement. It is a highly optimized "Snapshot" (or Materialized View). 

### Why do we need both?
1. **Performance:** If a user opens the "Available Inventory" dashboard, querying millions of historical `StockMovement` rows to calculate `SUM(in) - SUM(out)` on the fly would crash the database. The `Stock` table allows for instant, millisecond lookups.
2. **Preventing Race Conditions:** When a sales rep confirms an order, the database must temporarily "lock" the `Stock` row to deduct inventory, preventing two reps from accidentally selling the same final item. You cannot lock a calculated sum.
3. **Traceability:** Auditors, recalls, and discrepancy investigations require a complete, timestamped history of who moved what, when, and why (`StockMovement`).

---

## 2. The Golden Rule of Movement

The secret to routing inventory correctly lies entirely in the **`from_location_id`** and **`to_location_id`** on the `StockMovement` table.

| Action | `from_location_id` | `to_location_id` | Effect on Company Stock |
| :--- | :--- | :--- | :--- |
| **Receive (Purchasing, Mfg)** | `NULL` *(Outside)* | Valid ID *(Inside)* | **Increases (+)** |
| **Ship / Consume (Sales, Mfg)** | Valid ID *(Inside)* | `NULL` *(Outside)* | **Decreases (-)** |
| **Internal Transfer** | Valid ID *(Inside)* | Valid ID *(Inside)* | **No Change (0)** |

---

## 3. Workflow Scenarios

Here is exactly how the database handles common physical events:

### Scenario A: Purchasing (Receiving Goods)
A delivery truck arrives with 50 gallons of resin from a supplier (Batch 123).
*   **Action:** Goods appear from outside the company into the warehouse.
*   **`StockMovement` (INSERT):** 
    *   `from_location`: `NULL`
    *   `to_location`: Warehouse A
    *   `quantity`: 50
    *   `batch_number`: BATCH-123
    *   `movement_type`: `PO_RECEIPT`
*   **`Stock` (UPSERT):** The system checks if a row for this exact product + warehouse + batch already exists. If yes, it adds 50 to the quantity. If no, it creates a new row with quantity 50.

### Scenario B: Manufacturing (Material Consumption)
A worker pulls 10 gallons of resin (Batch 123) off the shelf to build a boat hull.
*   **Action:** Goods are permanently destroyed/consumed inside the factory.
*   **`StockMovement` (INSERT):** 
    *   `from_location`: Warehouse A
    *   `to_location`: `NULL`
    *   `quantity`: 10
    *   `batch_number`: BATCH-123
    *   `movement_type`: `WO_CONSUMPTION`
*   **`Stock` (UPDATE):** The system deducts 10 from the specific `Stock` row matching Batch 123.

### Scenario C: Manufacturing (Finished Goods Production)
The boat hull is finished and rolls off the assembly line into the finished goods lot.
*   **Action:** A brand new item appears from the factory floor.
*   **`StockMovement` (INSERT):**
    *   `from_location`: `NULL`
    *   `to_location`: Finished Goods Lot
    *   `quantity`: 1
    *   `serial_number_id`: HIN-999
    *   `movement_type`: `WO_PRODUCTION`
*   **`Stock` (INSERT):** A new row is created for the boat in the Finished Goods Lot.

### Scenario D: Sales (Shipping to Customer)
The boat is loaded onto a trailer and sold to a customer.
*   **Action:** Goods permanently leave the company.
*   **`StockMovement` (INSERT):**
    *   `from_location`: Finished Goods Lot
    *   `to_location`: `NULL`
    *   `quantity`: 1
    *   `serial_number_id`: HIN-999
    *   `movement_type`: `SALES_SHIPMENT`
*   **`Stock` (UPDATE):** The system deducts 1 from the Stock row, leaving 0 (or optionally deletes the row).

### Scenario E: Inventory Cycle Counts (Adjustments)
A warehouse worker counts 48 gallons of resin, but the computer says there should be 50. Two gallons were spilled and not reported.
*   **Action:** Goods vanished, and the books must be reconciled.
*   **`StockMovement` (INSERT):**
    *   `from_location`: Warehouse A
    *   `to_location`: `NULL`
    *   `quantity`: 2
    *   `movement_type`: `INVENTORY_ADJUSTMENT`
    *   `related_order_type`: `InventoryCount`
*   **`Stock` (UPDATE):** The system deducts 2 from the Stock row, bringing the ledger into agreement with physical reality.

---

## 4. The Backend Transaction

When writing the backend services (e.g., Node.js / Drizzle ORM), any inventory change must occur inside a **Database Transaction**. 

```typescript
await db.transaction(async (tx) => {
  // 1. Always INSERT the Ledger Entry
  await tx.insert(stockMovements).values({ ... });

  // 2. UPSERT the Current Balance Snapshot
  await tx.insert(stock)
    .values({ product_id, warehouse_id, batch_number, quantity: 50 })
    .onConflictDoUpdate({
      target: [stock.product_id, stock.warehouse_id, stock.batch_number],
      set: { quantity: sql`${stock.quantity} + 50` }
    });
});
```
If either step fails, the entire transaction rolls back. This guarantees that your `Stock` balance and your `StockMovement` history are mathematically identical forever.
