-- CreateTable
CREATE TABLE "Usuario" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "apellido" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "contraseña" TEXT NOT NULL,
    "id_area" INTEGER NOT NULL,
    "id_rol" INTEGER NOT NULL,

    CONSTRAINT "Usuario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Jornada" (
    "id_jornada" SERIAL NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL,
    "hora_checkin" TIMESTAMP(3) NOT NULL,
    "hora_checkout" TIMESTAMP(3) NOT NULL,
    "aprobado" BOOLEAN NOT NULL,
    "id_usuario" INTEGER NOT NULL,
    "id_supervisor" INTEGER NOT NULL,

    CONSTRAINT "Jornada_pkey" PRIMARY KEY ("id_jornada")
);

-- CreateTable
CREATE TABLE "Actividad" (
    "id" SERIAL NOT NULL,
    "id_jornada" INTEGER NOT NULL,
    "tarea" TEXT NOT NULL,
    "meta" TEXT NOT NULL,
    "id_estado" INTEGER NOT NULL,
    "observaciones" TEXT,

    CONSTRAINT "Actividad_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Comentario" (
    "id" SERIAL NOT NULL,
    "id_actividad" INTEGER NOT NULL,
    "id_supervisor" INTEGER NOT NULL,
    "comentario" TEXT NOT NULL,
    "fecha_comentario" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Comentario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Estado" (
    "id" SERIAL NOT NULL,
    "nombre_estado" TEXT NOT NULL,

    CONSTRAINT "Estado_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Rol" (
    "id" SERIAL NOT NULL,
    "nombre_rol" TEXT NOT NULL,

    CONSTRAINT "Rol_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Area" (
    "id" SERIAL NOT NULL,
    "nombre_area" TEXT NOT NULL,

    CONSTRAINT "Area_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Auditoria" (
    "id" SERIAL NOT NULL,
    "id_usuario" INTEGER NOT NULL,
    "accion" TEXT NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "descripcion" TEXT,

    CONSTRAINT "Auditoria_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_email_key" ON "Usuario"("email");

-- AddForeignKey
ALTER TABLE "Usuario" ADD CONSTRAINT "Usuario_id_area_fkey" FOREIGN KEY ("id_area") REFERENCES "Area"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Usuario" ADD CONSTRAINT "Usuario_id_rol_fkey" FOREIGN KEY ("id_rol") REFERENCES "Rol"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Jornada" ADD CONSTRAINT "Jornada_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Jornada" ADD CONSTRAINT "Jornada_id_supervisor_fkey" FOREIGN KEY ("id_supervisor") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Actividad" ADD CONSTRAINT "Actividad_id_jornada_fkey" FOREIGN KEY ("id_jornada") REFERENCES "Jornada"("id_jornada") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Actividad" ADD CONSTRAINT "Actividad_id_estado_fkey" FOREIGN KEY ("id_estado") REFERENCES "Estado"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comentario" ADD CONSTRAINT "Comentario_id_actividad_fkey" FOREIGN KEY ("id_actividad") REFERENCES "Actividad"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comentario" ADD CONSTRAINT "Comentario_id_supervisor_fkey" FOREIGN KEY ("id_supervisor") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Auditoria" ADD CONSTRAINT "Auditoria_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
