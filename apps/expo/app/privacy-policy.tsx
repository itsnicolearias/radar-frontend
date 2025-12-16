"use client"

import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from "react-native"
import { useRouter } from "expo-router"
import { ArrowLeft } from "lucide-react-native"

export default function PrivacidadScreen() {
  const router = useRouter()

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <ArrowLeft size={24} color="#00FFB3" />
      </TouchableOpacity>

      <Text style={styles.title}>Política de Privacidad</Text>
      <Text style={styles.lastUpdated}>Última actualización: Diciembre 2025</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>1. Información que Recopilamos</Text>
        <Text style={styles.paragraph}>
          Recopilamos información personal que usted nos proporciona directamente, como nombre, apellido, correo
          electrónico, fecha de nacimiento, ubicación, fotos de perfil e información de perfil.
        </Text>
        <Text style={styles.paragraph}>
          También recopilamos información automáticamente sobre su dispositivo, ubicación geográfica y uso de la
          aplicación mediante tecnologías como cookies y datos de geolocalización.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>2. Uso de la Información</Text>
        <Text style={styles.paragraph}>Utilizamos su información para:</Text>
        <Text style={styles.bulletPoint}>• Proporcionar y mantener nuestros servicios</Text>
        <Text style={styles.bulletPoint}>• Conectar usuarios cercanos mediante geolocalización</Text>
        <Text style={styles.bulletPoint}>• Personalizar su experiencia en la aplicación</Text>
        <Text style={styles.bulletPoint}>• Comunicarnos con usted sobre actualizaciones y notificaciones</Text>
        <Text style={styles.bulletPoint}>• Mejorar nuestros servicios mediante análisis de uso</Text>
        <Text style={styles.bulletPoint}>• Garantizar la seguridad y prevenir fraudes</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>3. Compartir Información</Text>
        <Text style={styles.paragraph}>
          No vendemos su información personal. Podemos compartir información limitada con:
        </Text>
        <Text style={styles.bulletPoint}>• Otros usuarios de la aplicación (según su configuración de privacidad)</Text>
        <Text style={styles.bulletPoint}>• Proveedores de servicios que nos ayudan a operar la aplicación</Text>
        <Text style={styles.bulletPoint}>
          • Autoridades legales cuando sea requerido por ley o para proteger nuestros derechos
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>4. Geolocalización</Text>
        <Text style={styles.paragraph}>
          Radar utiliza su ubicación en tiempo real para conectarlo con usuarios cercanos. Puede controlar el acceso a
          su ubicación mediante la configuración de su dispositivo y la función de "Modo Invisible" en la aplicación.
        </Text>
        <Text style={styles.paragraph}>
          Su ubicación exacta nunca se muestra a otros usuarios; solo se comparte la distancia aproximada entre
          usuarios.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>5. Seguridad de Datos</Text>
        <Text style={styles.paragraph}>
          Implementamos medidas de seguridad técnicas y organizativas para proteger su información personal contra
          acceso no autorizado, alteración o divulgación.
        </Text>
        <Text style={styles.paragraph}>
          Sin embargo, ningún método de transmisión por Internet es 100% seguro, por lo que no podemos garantizar la
          seguridad absoluta.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>6. Sus Derechos</Text>
        <Text style={styles.paragraph}>Usted tiene derecho a:</Text>
        <Text style={styles.bulletPoint}>• Acceder a su información personal</Text>
        <Text style={styles.bulletPoint}>• Corregir información inexacta</Text>
        <Text style={styles.bulletPoint}>• Solicitar la eliminación de sus datos</Text>
        <Text style={styles.bulletPoint}>• Oponerse al procesamiento de sus datos</Text>
        <Text style={styles.bulletPoint}>• Retirar su consentimiento en cualquier momento</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>7. Retención de Datos</Text>
        <Text style={styles.paragraph}>
          Conservamos su información mientras su cuenta esté activa o según sea necesario para proporcionar servicios.
          Puede solicitar la eliminación de su cuenta en cualquier momento desde la configuración de la aplicación.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>8. Cambios a esta Política</Text>
        <Text style={styles.paragraph}>
          Podemos actualizar esta política ocasionalmente. Le notificaremos sobre cambios significativos mediante un
          aviso en la aplicación o por correo electrónico.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>9. Contacto</Text>
        <Text style={styles.paragraph}>
          Si tiene preguntas sobre esta Política de Privacidad, contáctenos en: privacy@radar-app.com
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
