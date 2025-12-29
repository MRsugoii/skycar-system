
async function checkOrders() {
    const { data: orders } = await supabase.from('orders').select('id, note, status, pickup_time').order('created_at', { ascending: false }).limit(5);
    console.log(JSON.stringify(orders, null, 2));
}
checkOrders();

