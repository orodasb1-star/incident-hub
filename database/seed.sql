-- Datos iniciales para desarrollo y demostracion
INSERT INTO tecnicos (nombre) VALUES ('Tecnico Uno'), ('Tecnico Dos'), ('Tecnico Tres');

INSERT INTO incidentes (titulo, descripcion, categoria, prioridad, usuario, estado, tecnico_id) VALUES
  ('Sin internet en oficina 3', 'Ningun equipo de la oficina 3 tiene conexion', 'RED', 'CRITICA', 'recepcion', 'ASIGNADO', 1),
  ('Impresora no imprime', 'La impresora del segundo nivel muestra error de papel', 'HARDWARE', 'MEDIA', 'contabilidad', 'NUEVO', NULL),
  ('Reset de contrasena', 'Usuario bloqueado en el sistema de planillas', 'ACCESO', 'ALTA', 'rrhh', 'EN_PROCESO', 2),
  ('Office no activa', 'Microsoft Office solicita activacion', 'SOFTWARE', 'BAJA', 'gerencia', 'RESUELTO', 3);

INSERT INTO comentarios (incidente_id, autor, texto) VALUES
  (1, 'Tecnico Uno', 'Se revisa el switch del rack principal'),
  (3, 'Tecnico Dos', 'Se desbloquea la cuenta, pendiente confirmar con el usuario');
