ALTER TABLE "vs_coordination_capability_grant" DROP CONSTRAINT "vs_coordination_capability_grant_capability_check";
ALTER TABLE "vs_coordination_capability_grant" ADD CONSTRAINT "vs_coordination_capability_grant_capability_check" CHECK ("capability" IN ('coordination.create','coordination.assign','coordination.work','coordination.verify','coordination.manage','coordination.history'));
