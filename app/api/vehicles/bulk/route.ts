@@ .. @@
     const results = plates.map((plate: string) => {
-      const vehicle = db.findVehicleByPlate(plate);
+      const vehicle = db.getVehicleByPlate(plate);
       if (!vehicle) return { plate, found: false };
       const insurer = db.getInsurerById(vehicle.insurerId);
-      const status = db.getInsuranceStatus(vehicle.policyEndDate);
+      const status = db.getPolicyStatus(vehicle.policyEndDate);
       return { plate, found: true, vehicle, insurer, status };
     });