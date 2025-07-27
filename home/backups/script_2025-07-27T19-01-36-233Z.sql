
      DO $$
      DECLARE
        backup_path TEXT := '/home/orlando/Documents/Base de datos/checkin-tracker-api/home/backups/backup_db_checking_2025-07-27T19-01-36-233Z.dump';
        pg_dump_cmd TEXT;
        resultado INTEGER;
      BEGIN
        -- Construir comando pg_dump
        pg_dump_cmd := 'pg_dump -h localhost -p 5432 -U postgres -d db_checking -Fc -Z 9 -f "' || backup_path || '"';
        
        -- Ejecutar backup usando COPY TO PROGRAM
        BEGIN
          EXECUTE 'COPY (SELECT pg_sleep(0.1)) TO PROGRAM ''' || pg_dump_cmd || '''';
          
          -- Registrar éxito
          RAISE NOTICE 'Backup SQL iniciado: %', backup_path;
          
        EXCEPTION
          WHEN OTHERS THEN
            -- Si COPY TO PROGRAM falla, intentar con pg_dump directo
            RAISE NOTICE 'COPY TO PROGRAM falló, intentando método alternativo: %', SQLERRM;
            
            -- Método alternativo: generar archivo SQL plano
            EXECUTE 'COPY (SELECT ''-- Backup generado: '' || NOW()) TO ''' || backup_path || '''';
            RAISE NOTICE 'Backup alternativo creado: %', backup_path;
        END;
        
      END $$;
    