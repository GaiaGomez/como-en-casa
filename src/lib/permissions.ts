export type Permissions = {
  canEditHorario: boolean;
  canEditPropinas: boolean;
  canEditEquipo: boolean;
  canEditInventario: boolean;
  canEditCompras: boolean;
};

export function getPermissions(role: string | null | undefined): Permissions {
  const admin = role === "admin";
  const team = role === "employee" || role === "equipo";
  return {
    canEditHorario: admin,
    canEditPropinas: admin,
    canEditEquipo: admin,
    canEditInventario: admin || team,
    canEditCompras: admin,
  };
}

export function isDemoRole(role: string | null | undefined): boolean {
  return role === "demo";
}
