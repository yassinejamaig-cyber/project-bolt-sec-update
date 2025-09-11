export interface Vehicle {
  id: string;
  plate: string;
  make: string;
  model: string;
  year: number;
  ownerId: string;
  insurerId: string;
  policyNumber: string;
  policyStartDate: string;
  policyEndDate: string;
}

export interface Owner {
  id: string;
  name: string;
  phone: string;
  email: string;
  address: string;
}

export interface Insurer {
  id: string;
  name: string;
  phone: string;
  email: string;
}

export interface Officer {
  id: string;
  username: string;
  password: string; // In production, this would be hashed
  name: string;
  role: 'officer' | 'supervisor' | 'admin';
}

export interface LookupLog {
  id: string;
  officerId: string;
  officerName: string;
  plate: string;
  timestamp: string;
  result: 'found' | 'not_found';
  vehicleInfo?: {
    owner: string;
    make: string;
    model: string;
    insurer: string;
    status: string;
  };
}

class InMemoryDatabase {
  private vehicles: Map<string, Vehicle> = new Map();
  private owners: Map<string, Owner> = new Map();
  private insurers: Map<string, Insurer> = new Map();
  private officers: Map<string, Officer> = new Map();
  private lookupLogs: LookupLog[] = [];

  constructor() {
    this.seedData();
  }

  private seedData() {
    // Seed insurers
    const insurers: Insurer[] = [
      { id: '1', name: 'SafeDrive Insurance', phone: '+1-555-0101', email: 'info@safedrive.com' },
      { id: '2', name: 'AutoProtect Ltd', phone: '+1-555-0102', email: 'support@autoprotect.com' },
      { id: '3', name: 'VehicleCare Insurance', phone: '+1-555-0103', email: 'contact@vehiclecare.com' }
    ];

    insurers.forEach(insurer => this.insurers.set(insurer.id, insurer));

    // Seed owners
    const owners: Owner[] = [
      { id: '1', name: 'John Smith', phone: '+1-555-1001', email: 'john.smith@email.com', address: '123 Main St, City' },
      { id: '2', name: 'Sarah Johnson', phone: '+1-555-1002', email: 'sarah.johnson@email.com', address: '456 Oak Ave, City' },
      { id: '3', name: 'Mike Wilson', phone: '+1-555-1003', email: 'mike.wilson@email.com', address: '789 Pine Rd, City' },
      { id: '4', name: 'Emily Davis', phone: '+1-555-1004', email: 'emily.davis@email.com', address: '321 Elm St, City' },
      { id: '5', name: 'David Brown', phone: '+1-555-1005', email: 'david.brown@email.com', address: '654 Birch Dr, City' },
      { id: '6', name: 'Lisa Miller', phone: '+1-555-1006', email: 'lisa.miller@email.com', address: '987 Cedar Ln, City' },
      { id: '7', name: 'James Taylor', phone: '+1-555-1007', email: 'james.taylor@email.com', address: '147 Maple Ave, City' },
      { id: '8', name: 'Anna Garcia', phone: '+1-555-1008', email: 'anna.garcia@email.com', address: '258 Spruce St, City' },
      { id: '9', name: 'Robert Lee', phone: '+1-555-1009', email: 'robert.lee@email.com', address: '369 Walnut Dr, City' },
      { id: '10', name: 'Jessica White', phone: '+1-555-1010', email: 'jessica.white@email.com', address: '741 Cherry Rd, City' }
    ];

    owners.forEach(owner => this.owners.set(owner.id, owner));

    // Seed vehicles with mixed policy statuses
    const now = new Date();
    const vehicles: Vehicle[] = [
      {
        id: '1', plate: 'ABC123', make: 'Toyota', model: 'Camry', year: 2020, ownerId: '1', insurerId: '1',
        policyNumber: 'SD001', policyStartDate: '2024-01-01', policyEndDate: '2024-12-31'
      },
      {
        id: '2', plate: 'XYZ789', make: 'Honda', model: 'Civic', year: 2021, ownerId: '2', insurerId: '2',
        policyNumber: 'AP002', policyStartDate: '2024-01-15', policyEndDate: '2025-01-15'
      },
      {
        id: '3', plate: 'DEF456', make: 'Ford', model: 'F-150', year: 2019, ownerId: '3', insurerId: '1',
        policyNumber: 'SD003', policyStartDate: '2023-06-01', policyEndDate: '2024-05-31' // Expired
      },
      {
        id: '4', plate: 'GHI789', make: 'BMW', model: 'X5', year: 2022, ownerId: '4', insurerId: '3',
        policyNumber: 'VC004', policyStartDate: '2024-03-01', policyEndDate: '2025-03-01'
      },
      {
        id: '5', plate: 'JKL012', make: 'Mercedes', model: 'C-Class', year: 2023, ownerId: '5', insurerId: '2',
        policyNumber: 'AP005', policyStartDate: '2024-01-01', policyEndDate: new Date(now.getTime() + 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] // Expires in 15 days
      },
      {
        id: '6', plate: 'MNO345', make: 'Audi', model: 'A4', year: 2020, ownerId: '6', insurerId: '1',
        policyNumber: 'SD006', policyStartDate: '2024-02-01', policyEndDate: '2025-02-01'
      },
      {
        id: '7', plate: 'PQR678', make: 'Nissan', model: 'Altima', year: 2021, ownerId: '7', insurerId: '3',
        policyNumber: 'VC007', policyStartDate: '2023-12-01', policyEndDate: '2024-11-30' // Expired
      },
      {
        id: '8', plate: 'STU901', make: 'Volkswagen', model: 'Jetta', year: 2022, ownerId: '8', insurerId: '2',
        policyNumber: 'AP008', policyStartDate: '2024-04-01', policyEndDate: '2025-04-01'
      },
      {
        id: '9', plate: 'VWX234', make: 'Hyundai', model: 'Elantra', year: 2020, ownerId: '9', insurerId: '1',
        policyNumber: 'SD009', policyStartDate: '2024-01-01', policyEndDate: new Date(now.getTime() + 25 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] // Expires in 25 days
      },
      {
        id: '10', plate: 'YZA567', make: 'Chevrolet', model: 'Malibu', year: 2021, ownerId: '10', insurerId: '3',
        policyNumber: 'VC010', policyStartDate: '2024-05-01', policyEndDate: '2025-05-01'
      }
    ];

    vehicles.forEach(vehicle => this.vehicles.set(vehicle.plate.toUpperCase(), vehicle));

    // Seed officers
    const officers: Officer[] = [
      { id: '1', username: 'officer1', password: 'password123', name: 'Officer Smith', role: 'officer' },
      { id: '2', username: 'supervisor1', password: 'password123', name: 'Supervisor Johnson', role: 'supervisor' },
      { id: '3', username: 'admin1', password: 'password123', name: 'Admin Wilson', role: 'admin' }
    ];

    officers.forEach(officer => this.officers.set(officer.username, officer));
  }

  // Vehicle operations
  getVehicleByPlate(plate: string): Vehicle | undefined {
    return this.vehicles.get(plate.toUpperCase());
  }

  // Owner operations
  getOwnerById(id: string): Owner | undefined {
    return this.owners.get(id);
  }

  // Insurer operations
  getInsurerById(id: string): Insurer | undefined {
    return this.insurers.get(id);
  }

  // Officer operations
  getOfficerByUsername(username: string): Officer | undefined {
    return this.officers.get(username);
  }

  // Lookup log operations
  addLookupLog(log: Omit<LookupLog, 'id'>): void {
    const newLog: LookupLog = {
      ...log,
      id: Date.now().toString()
    };
    this.lookupLogs.push(newLog);
  }

  getLookupLogs(): LookupLog[] {
    return [...this.lookupLogs].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }

  // Helper method to get policy status
  getPolicyStatus(endDate: string): { status: 'active' | 'expiring' | 'expired', daysUntilExpiry: number } {
    const now = new Date();
    const expiry = new Date(endDate);
    const diffTime = expiry.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return { status: 'expired', daysUntilExpiry: diffDays };
    } else if (diffDays <= 30) {
      return { status: 'expiring', daysUntilExpiry: diffDays };
    } else {
      return { status: 'active', daysUntilExpiry: diffDays };
    }
  }
}

export const db = new InMemoryDatabase();