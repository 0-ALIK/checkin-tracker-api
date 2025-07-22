const nodemailer = require('nodemailer');

// Configuración del email (igual que en nuestro servicio)
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
        user: 'flaviomoises01@gmail.com',
        pass: 'avmyzbgpsdlbyosg'
    },
    debug: false,
    logger: false
});

console.log('📧 Probando envío de email...');

// Test de email de éxito
const emailExito = {
    from: 'Sistema de Checkin <flaviomoises01@gmail.com>',
    to: 'flaviomoises01@gmail.com', // Enviar a nosotros mismos
    subject: '✅ Backup Exitoso - Prueba del Sistema',
    html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #16a34a;">✅ Backup Completado Exitosamente</h2>
            <div style="background: #f0f9ff; padding: 15px; border-radius: 5px; margin: 15px 0;">
                <p><strong>Fecha:</strong> ${new Date().toLocaleString('es-ES')}</p>
                <p><strong>Archivo:</strong> backup_test_${new Date().toISOString().slice(0,10)}.dump</p>
                <p><strong>Tamaño:</strong> 26.1 KB</p>
                <p><strong>Estado:</strong> <span style="color: #16a34a;">Completado</span></p>
            </div>
            <p>El backup de la base de datos se ha completado correctamente y se encuentra almacenado de forma segura.</p>
            <hr>
            <p style="color: #666; font-size: 12px;">
                <em>Este es un email de prueba del sistema de backup automático.</em><br>
                Sistema de Checkin - Control de Jornadas Laborales
            </p>
        </div>
    `
};

transporter.sendMail(emailExito, (error, info) => {
    if (error) {
        console.error('❌ Error al enviar email:', error.message);
        console.error('📋 Detalles:', error);
    } else {
        console.log('✅ Email de prueba enviado exitosamente!');
        console.log('📧 Message ID:', info.messageId);
        console.log('📬 Para:', emailExito.to);
        console.log('📝 Asunto:', emailExito.subject);
        console.log('🎉 Revisa tu bandeja de entrada!');
    }
    
    process.exit(0);
});
