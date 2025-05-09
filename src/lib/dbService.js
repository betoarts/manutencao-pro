import pool from './db';

// Funções para Assets
export const getAssets = async () => {
    const result = await pool.query('SELECT * FROM assets ORDER BY created_at DESC');
    return result.rows;
};

export const createAsset = async (asset) => {
    const result = await pool.query(
        'INSERT INTO assets (asset_id, name, description, location, status, category, manufacturer, model, serial_number, installation_date) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *',
        [asset.asset_id, asset.name, asset.description, asset.location, asset.status, asset.category, asset.manufacturer, asset.model, asset.serial_number, asset.installation_date]
    );
    return result.rows[0];
};

export const updateAsset = async (id, asset) => {
    const result = await pool.query(
        'UPDATE assets SET asset_id = $1, name = $2, description = $3, location = $4, status = $5, category = $6, manufacturer = $7, model = $8, serial_number = $9, installation_date = $10 WHERE id = $11 RETURNING *',
        [asset.asset_id, asset.name, asset.description, asset.location, asset.status, asset.category, asset.manufacturer, asset.model, asset.serial_number, asset.installation_date, id]
    );
    return result.rows[0];
};

export const deleteAsset = async (id) => {
    await pool.query('DELETE FROM assets WHERE id = $1', [id]);
};

// Funções para Maintenance Plans
export const getMaintenancePlans = async () => {
    const result = await pool.query(`
        SELECT mp.*, a.name as asset_name, a.asset_id 
        FROM maintenance_plans mp 
        LEFT JOIN assets a ON mp.asset_id = a.id 
        ORDER BY mp.created_at DESC
    `);
    return result.rows;
};

export const createMaintenancePlan = async (plan) => {
    const result = await pool.query(
        'INSERT INTO maintenance_plans (name, description, frequency, interval_days, usage_hours_trigger, condition_trigger, next_due_date, assigned_to_team, asset_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *',
        [plan.name, plan.description, plan.frequency, plan.interval_days, plan.usage_hours_trigger, plan.condition_trigger, plan.next_due_date, plan.assigned_to_team, plan.asset_id]
    );
    return result.rows[0];
};

export const updateMaintenancePlan = async (id, plan) => {
    const result = await pool.query(
        'UPDATE maintenance_plans SET name = $1, description = $2, frequency = $3, interval_days = $4, usage_hours_trigger = $5, condition_trigger = $6, next_due_date = $7, assigned_to_team = $8, asset_id = $9 WHERE id = $10 RETURNING *',
        [plan.name, plan.description, plan.frequency, plan.interval_days, plan.usage_hours_trigger, plan.condition_trigger, plan.next_due_date, plan.assigned_to_team, plan.asset_id, id]
    );
    return result.rows[0];
};

export const deleteMaintenancePlan = async (id) => {
    await pool.query('DELETE FROM maintenance_plans WHERE id = $1', [id]);
};

// Funções para Work Orders
export const getWorkOrders = async () => {
    const result = await pool.query(`
        SELECT wo.*, a.name as asset_name, a.asset_id, mp.name as plan_name
        FROM work_orders wo
        LEFT JOIN assets a ON wo.asset_id = a.id
        LEFT JOIN maintenance_plans mp ON wo.maintenance_plan_id = mp.id
        ORDER BY wo.created_at DESC
    `);
    return result.rows;
};

export const createWorkOrder = async (workOrder) => {
    const result = await pool.query(
        'INSERT INTO work_orders (work_order_id, type, status, priority, description, reported_by, assigned_to_team, asset_id, maintenance_plan_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *',
        [workOrder.work_order_id, workOrder.type, workOrder.status, workOrder.priority, workOrder.description, workOrder.reported_by, workOrder.assigned_to_team, workOrder.asset_id, workOrder.maintenance_plan_id]
    );
    return result.rows[0];
};

export const updateWorkOrder = async (id, workOrder) => {
    const result = await pool.query(
        'UPDATE work_orders SET work_order_id = $1, type = $2, status = $3, priority = $4, description = $5, reported_by = $6, assigned_to_team = $7, asset_id = $8, maintenance_plan_id = $9 WHERE id = $10 RETURNING *',
        [workOrder.work_order_id, workOrder.type, workOrder.status, workOrder.priority, workOrder.description, workOrder.reported_by, workOrder.assigned_to_team, workOrder.asset_id, workOrder.maintenance_plan_id, id]
    );
    return result.rows[0];
};

export const deleteWorkOrder = async (id) => {
    await pool.query('DELETE FROM work_orders WHERE id = $1', [id]);
};

// Funções para Inventory Items
export const getInventoryItems = async () => {
    const result = await pool.query('SELECT * FROM inventory_items ORDER BY created_at DESC');
    return result.rows;
};

export const createInventoryItem = async (item) => {
    const result = await pool.query(
        'INSERT INTO inventory_items (item_id, name, description, quantity, min_stock_level, unit_cost, location, supplier, part_number, category) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *',
        [item.item_id, item.name, item.description, item.quantity, item.min_stock_level, item.unit_cost, item.location, item.supplier, item.part_number, item.category]
    );
    return result.rows[0];
};

export const updateInventoryItem = async (id, item) => {
    const result = await pool.query(
        'UPDATE inventory_items SET item_id = $1, name = $2, description = $3, quantity = $4, min_stock_level = $5, unit_cost = $6, location = $7, supplier = $8, part_number = $9, category = $10 WHERE id = $11 RETURNING *',
        [item.item_id, item.name, item.description, item.quantity, item.min_stock_level, item.unit_cost, item.location, item.supplier, item.part_number, item.category, id]
    );
    return result.rows[0];
};

export const deleteInventoryItem = async (id) => {
    await pool.query('DELETE FROM inventory_items WHERE id = $1', [id]);
}; 