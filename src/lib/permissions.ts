import type { UserRole } from "./supabase/auth";

export type Permissions = {
  canEditHorario: boolean;
  canEditPropinas: boolean;
  canEditEquipo: boolean;
  canEditInventario: boolean;
  canEditCompras: boolean;
};

export function getPermissions(role: UserRole | null | undefined): Permissions {
  const admin = role === "admin";
  const equipo = role === "employee";
  return {
    canEditHorario: admin,
    canEditPropinas: admin,
    canEditEquipo: admin,
    canEditInventario: admin || equipo,
    canEditCompras: admin,
  };
}
