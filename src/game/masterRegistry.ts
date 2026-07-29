export const MASTER_REGISTRY = {
  vehicle: [
    { vehicle_plate: 'D 4123 QX', owner_id: 501, brand: 'Toyota', status: 'ACTIVE', registered_address: 'Jl. Melur Lama No. 9' },
    { vehicle_plate: 'B 8842 KL', owner_id: 502, brand: 'Honda', status: 'ACTIVE', registered_address: 'Jl. Kenanga No. 5' },
    { vehicle_plate: 'D 2210 RS', owner_id: 503, brand: 'Suzuki', status: 'ACTIVE', registered_address: 'Jl. Anggrek No. 12' }
  ],
  owner: [
    { owner_id: 501, owner_name: 'Herlina Wijaya', address: 'Jl. Melur Baru No. 21', phone: '081233221100' },
    { owner_id: 502, owner_name: 'Taufik Ramadhan', address: 'Jl. Kenanga No. 5', phone: '081244556677' },
    { owner_id: 503, owner_name: 'Ningsih Saputra', address: 'Jl. Anggrek No. 12', phone: '081255667788' }
  ],
  address: [
    { address_id: 1, full_address: 'Jl. Melur Lama No. 9', linked_entity_id: 501, linked_case: 'CASE002', timestamp: '2026-08-03 01:00:00' },
    { address_id: 2, full_address: 'Jl. Melur Baru No. 21', linked_entity_id: 501, linked_case: 'CASE002', timestamp: '2026-08-03 01:00:00' }
  ],
  sync_log: [
    { sync_id: 1, status: 'SUCCESS', integrity_check: 'PASS', replication: 'PASS', timestamp: '2026-08-02 23:59:00' },
    { sync_id: 2, status: 'SUCCESS', integrity_check: 'PASS', replication: 'PASS', timestamp: '2026-08-03 00:15:00' }
  ]
};
