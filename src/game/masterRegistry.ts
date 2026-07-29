export const MASTER_REGISTRY = {
  vehicle: [
    { vehicle_plate: 'D 4123 QX', owner_id: 501, brand: 'Toyota', status: 'ACTIVE', registered_address: 'Jl. Melur Lama No. 9' },
    { vehicle_plate: 'B 8842 KL', owner_id: 502, brand: 'Honda', status: 'ACTIVE', registered_address: 'Jl. Kenanga No. 5' },
    { vehicle_plate: 'D 2210 RS', owner_id: 503, brand: 'Suzuki', status: 'ACTIVE', registered_address: 'Jl. Anggrek No. 12' },
    { vehicle_plate: 'B 3311 FG', owner_id: 504, brand: 'Daihatsu', status: 'ACTIVE', registered_address: 'Jl. Flamboyan No. 2' },
    { vehicle_plate: 'B 7765 HJ', owner_id: 505, brand: 'Toyota', status: 'ACTIVE', registered_address: 'Jl. Mawar No. 19' },
    { vehicle_plate: 'D 5540 WQ', owner_id: 506, brand: 'Honda', status: 'ACTIVE', registered_address: 'Jl. Dahlia No. 7' },
    { vehicle_plate: 'B 2290 ZT', owner_id: 507, brand: 'Mitsubishi', status: 'ACTIVE', registered_address: 'Jl. Teratai No. 15' },
    { vehicle_plate: 'D 8871 LM', owner_id: 508, brand: 'Suzuki', status: 'ACTIVE', registered_address: 'Jl. Kamboja No. 3' },
    { vehicle_plate: 'B 4456 UY', owner_id: 509, brand: 'Toyota', status: 'ACTIVE', registered_address: 'Jl. Cempaka No. 11' },
    { vehicle_plate: 'B 1824 QC', owner_id: 510, brand: 'Honda', status: 'ACTIVE', registered_address: 'Jl. Cendana No. 8' },
    { vehicle_plate: 'D 6633 NP', owner_id: 511, brand: 'Daihatsu', status: 'ACTIVE', registered_address: 'Jl. Bougenville No. 6' },
    { vehicle_plate: 'B 9987 RT', owner_id: 512, brand: 'Suzuki', status: 'ACTIVE', registered_address: 'Jl. Sakura No. 14' }
  ],
  owner: [
    { owner_id: 501, owner_name: 'Herlina Wijaya', address: 'Jl. Melur Baru No. 21', phone: '081233221100' },
    { owner_id: 502, owner_name: 'Taufik Ramadhan', address: 'Jl. Kenanga No. 5', phone: '081244556677' },
    { owner_id: 503, owner_name: 'Ningsih Saputra', address: 'Jl. Anggrek No. 12', phone: '081255667788' },
    { owner_id: 504, owner_name: 'Yoga Pratama', address: 'Jl. Flamboyan No. 2', phone: '081266778899' },
    { owner_id: 505, owner_name: 'Citra Lestari', address: 'Jl. Mawar No. 19', phone: '081277889900' },
    { owner_id: 506, owner_name: 'Bimo Nugraha', address: 'Jl. Dahlia No. 7', phone: '081288990011' },
    { owner_id: 507, owner_name: 'Salsabila Putri', address: 'Jl. Teratai No. 15', phone: '081299001122' },
    { owner_id: 508, owner_name: 'Arya Wibawa', address: 'Jl. Kamboja No. 3', phone: '081200112233' },
    { owner_id: 509, owner_name: 'Kartika Sari', address: 'Jl. Cempaka No. 11', phone: '081211223344' },
    { owner_id: 510, owner_name: 'Rendra Saputra', address: 'Jl. Cendana No. 8', phone: '081222334455' },
    { owner_id: 511, owner_name: 'Farhan Maulana', address: 'Jl. Bougenville No. 6', phone: '081233445566' },
    { owner_id: 512, owner_name: 'Dewi Anggraini', address: 'Jl. Sakura No. 14', phone: '081244556600' }
  ],
  address: [
    { address_id: 1, full_address: 'Jl. Melur Lama No. 9', linked_entity_id: 501, linked_case: 'CASE002', timestamp: '2026-08-03 01:00:00' },
    { address_id: 2, full_address: 'Jl. Melur Baru No. 21', linked_entity_id: 501, linked_case: 'CASE002', timestamp: '2026-08-03 01:00:00' },
    { address_id: 3, full_address: 'Jl. Cendana Lama No. 3', linked_entity_id: 510, linked_case: 'CASE002', timestamp: '2026-08-03 02:00:00' }
  ],
  sync_log: [
    { sync_id: 1, status: 'SUCCESS', integrity_check: 'PASS', replication: 'PASS', timestamp: '2026-08-02 23:59:00' },
    { sync_id: 2, status: 'SUCCESS', integrity_check: 'PASS', replication: 'PASS', timestamp: '2026-08-03 00:15:00' }
  ]
};
