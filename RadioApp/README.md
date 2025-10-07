# Natalia Giraldo - Valerie Olave - Bylen Naspiran
# RadioFy - Aplicación de Radio Online

RadioFy es una aplicación web desarrollada con React que permite la reproducción de emisoras de radio en línea de todo el mundo. La aplicación implementa un sistema de búsqueda por país y nombre, junto con un reproductor global que mantiene el estado de reproducción a través de toda la interfaz.

## Funcionalidades Implementadas

### Sistema de Búsqueda
La aplicación permite buscar emisoras de radio mediante dos métodos:
- **Búsqueda por país**: Filtrado de emisoras por ubicación geográfica
- **Búsqueda por nombre**: Localización de emisoras específicas mediante texto

### Reproductor de Audio
- Reproductor global persistente que mantiene el estado entre navegaciones
- Control de reproducción (play/pause)
- Control de volumen ajustable
- Visualización de información de la emisora actual (nombre, país, logo)

### Interfaz de Usuario
- Diseño responsivo adaptable a diferentes dispositivos
- Sistema de tarjetas para mostrar información de emisoras
- Navegación mediante React Router
- Estados de carga y error informativos

### Componentes Principales
- **App**: Componente raíz con configuración de routing y providers
- **PlayBar**: Reproductor global con controles de audio
- **RadioCard**: Componente de tarjeta para mostrar información de emisoras
- **RadioList**: Contenedor para la lista de emisoras
- **RadioPage**: Página principal con funcionalidad de búsqueda

### Estado y Contexto
El estado global se maneja mediante Context API con las siguientes propiedades:
- `currentStation`: Emisora actualmente seleccionada
- `isPlaying`: Estado de reproducción actual
- `volume`: Nivel de volumen (0.0 - 1.0)
- `audioRef`: Referencia al elemento de audio HTML

