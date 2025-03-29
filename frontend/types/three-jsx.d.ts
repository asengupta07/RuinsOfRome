import { Object3D, Group } from 'three'

declare global {
  namespace JSX {
    interface IntrinsicElements {
      group: any
      primitive: any
      ambientLight: any
      spotLight: any
      pointLight: any
      mesh: any
      boxGeometry: any
      meshStandardMaterial: any
      color: any
      environment: any
      float: any
      perspectiveCamera: any
    }
  }
} 