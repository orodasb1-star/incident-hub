CREATE TABLE IF NOT EXISTS tecnicos (
  id      SERIAL PRIMARY KEY,
  nombre  VARCHAR(100) NOT NULL
);

CREATE TABLE IF NOT EXISTS incidentes (
  id          SERIAL PRIMARY KEY,
  titulo      VARCHAR(150) NOT NULL,
  descripcion TEXT NOT NULL,
  categoria   VARCHAR(20) NOT NULL CHECK (categoria IN ('HARDWARE','SOFTWARE','RED','ACCESO','OTRO')),
  prioridad   VARCHAR(10) NOT NULL CHECK (prioridad IN ('BAJA','MEDIA','ALTA','CRITICA')),
  usuario     VARCHAR(100) NOT NULL,
  estado      VARCHAR(15) NOT NULL DEFAULT 'NUEVO'
              CHECK (estado IN ('NUEVO','ASIGNADO','EN_PROCESO','RESUELTO','CERRADO')),
  tecnico_id  INT REFERENCES tecnicos(id),
  fecha       TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS comentarios (
  id           SERIAL PRIMARY KEY,
  incidente_id INT NOT NULL REFERENCES incidentes(id) ON DELETE CASCADE,
  autor        VARCHAR(100) NOT NULL,
  texto        TEXT NOT NULL,
  fecha        TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_incidentes_estado ON incidentes(estado);
CREATE INDEX IF NOT EXISTS idx_incidentes_tecnico ON incidentes(tecnico_id);
