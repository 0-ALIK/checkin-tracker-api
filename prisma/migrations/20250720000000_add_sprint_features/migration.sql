-- AlterTable
ALTER TABLE "Actividad" ADD COLUMN     "es_arrastrada" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "id_actividad_origen" INTEGER;

-- AddForeignKey
ALTER TABLE "Actividad" ADD CONSTRAINT "Actividad_id_actividad_origen_fkey" FOREIGN KEY ("id_actividad_origen") REFERENCES "Actividad"("id") ON DELETE SET NULL ON UPDATE CASCADE;
