"use client"

import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from "react-native"
import { useRouter } from "expo-router"
import { ArrowLeft } from "lucide-react-native"

export default function TerminosScreen() {
  const router = useRouter()

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <ArrowLeft size={24} color="#00FFB3" />
      </TouchableOpacity>

      <Text style={styles.title}>Términos y Condiciones</Text>
      <Text style={styles.lastUpdated}>Última actualización: Diciembre 2025</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>1. Aceptación de los Términos</Text>
        <Text style={styles.paragraph}>
          Al crear una cuenta y usar Radar, usted acepta estar sujeto a estos Términos y Condiciones. Si no está de
          acuerdo con alguna parte de estos términos, no debe usar nuestros servicios.
        </Text>
        <Text style={styles.paragraph}>
          Debe ser mayor de 18 años para usar Radar. Al registrarse, confirma que cumple con este requisito de edad.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>2. Descripción del Servicio</Text>
        <Text style={styles.paragraph}>
          Radar es una plataforma de conexión social basada en geolocalización que permite a usuarios descubrir y
          conectar con personas cercanas, organizar eventos, enviar señales temporales y chatear.
        </Text>
        <Text style={styles.paragraph}>
          Nos reservamos el derecho de modificar, suspender o discontinuar cualquier parte del servicio en cualquier
          momento.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>3. Registro de Cuenta</Text>
        <Text style={styles.paragraph}>
          Para usar Radar, debe crear una cuenta proporcionando información precisa y completa. Usted es responsable de
          mantener la confidencialidad de su contraseña y de todas las actividades que ocurran bajo su cuenta.
        </Text>
        <Text style={styles.paragraph}>
          Se compromete a notificarnos inmediatamente sobre cualquier uso no autorizado de su cuenta.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>4. Conducta del Usuario</Text>
        <Text style={styles.paragraph}>Usted acepta NO:</Text>
        <Text style={styles.bulletPoint}>• Publicar contenido ofensivo, difamatorio, o ilegal</Text>
        <Text style={styles.bulletPoint}>• Acosar, intimidar o amenazar a otros usuarios</Text>
        <Text style={styles.bulletPoint}>• Hacerse pasar por otra persona o entidad</Text>
        <Text style={styles.bulletPoint}>• Usar la aplicación para actividades comerciales no autorizadas</Text>
        <Text style={styles.bulletPoint}>• Intentar obtener acceso no autorizado a nuestros sistemas</Text>
        <Text style={styles.bulletPoint}>• Recopilar información de otros usuarios sin su consentimiento</Text>
        <Text style={styles.bulletPoint}>• Interferir con el funcionamiento normal de la aplicación</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>5. Contenido del Usuario</Text>
        <Text style={styles.paragraph}>
          Usted conserva todos los derechos sobre el contenido que publique en Radar (fotos, mensajes, información de
          perfil). Sin embargo, nos otorga una licencia mundial, no exclusiva y libre de regalías para usar, mostrar y
          distribuir su contenido dentro de la aplicación.
        </Text>
        <Text style={styles.paragraph}>
          Nos reservamos el derecho de eliminar contenido que viole estos términos o sea inapropiado.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>6. Geolocalización y Privacidad</Text>
        <Text style={styles.paragraph}>
          Al usar Radar, acepta compartir su ubicación con otros usuarios de acuerdo con la configuración de privacidad
          que elija. Puede activar el "Modo Invisible" en cualquier momento para ocultar su presencia.
        </Text>
        <Text style={styles.paragraph}>
          Su información se maneja según nuestra Política de Privacidad, que forma parte integral de estos términos.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>7. Señales Temporales</Text>
        <Text style={styles.paragraph}>
          Las señales enviadas en Radar son temporales y tienen una duración limitada (1 día por defecto). Una vez
          expiradas, las señales se eliminan automáticamente del sistema.
        </Text>
        <Text style={styles.paragraph}>Las señales deben usarse de manera responsable y no para spam o acoso.</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>8. Suspensión y Terminación</Text>
        <Text style={styles.paragraph}>
          Nos reservamos el derecho de suspender o terminar su cuenta si viola estos términos, sin previo aviso ni
          responsabilidad. Usted puede eliminar su cuenta en cualquier momento desde la configuración de la aplicación.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>9. Descargo de Responsabilidad</Text>
        <Text style={styles.paragraph}>
          Radar se proporciona "tal cual" sin garantías de ningún tipo. No garantizamos que el servicio sea
          ininterrumpido, seguro o libre de errores.
        </Text>
        <Text style={styles.paragraph}>
          No somos responsables por las interacciones entre usuarios o por el contenido publicado por terceros.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>10. Limitación de Responsabilidad</Text>
        <Text style={styles.paragraph}>
          En la máxima medida permitida por la ley, Radar y sus afiliados no serán responsables por daños indirectos,
          incidentales, especiales o consecuentes que surjan del uso de nuestros servicios.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>11. Cambios a los Términos</Text>
        <Text style={styles.paragraph}>
          Podemos modificar estos términos en cualquier momento. Los cambios significativos serán notificados mediante
          la aplicación. El uso continuado del servicio después de cambios constituye aceptación de los nuevos términos.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>12. Ley Aplicable</Text>
        <Text style={styles.paragraph}>
          Estos términos se regirán e interpretarán de acuerdo con las leyes de Argentina, sin tener en cuenta sus
          disposiciones sobre conflictos de leyes.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>13. Contacto</Text>
        <Text style={styles.paragraph}>
          Para preguntas sobre estos Términos y Condiciones, contáctenos en: support@radar-app.com
        </Text>
      </View>

      <View style={styles.bottomSpacer} />
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
  },
  content: {
    paddingHorizontal: 24,
    paddingVertical: 48,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(0, 255, 179, 0.3)",
    backgroundColor: "#101010",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 8,
  },
  lastUpdated: {
    fontSize: 14,
    color: "#64748B",
    marginBottom: 32,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#00FFB3",
    marginBottom: 12,
  },
  paragraph: {
    fontSize: 14,
    color: "#C5C5C5",
    lineHeight: 22,
    marginBottom: 12,
  },
  bulletPoint: {
    fontSize: 14,
    color: "#C5C5C5",
    lineHeight: 22,
    marginBottom: 8,
    paddingLeft: 8,
  },
  bottomSpacer: {
    height: 40,
  },
})
