import * as V3O from './V3O'
import { Quaternion } from './Quaternion'
import { V3 } from './V3'
import * as MathUtils from './MathUtils'

export const multiply = (a: Quaternion, b: Quaternion): Quaternion => {
  const qax = a[1]
  const qay = a[2]
  const qaz = a[3]
  const qaw = a[0]
  const qbx = b[1]
  const qby = b[2]
  const qbz = b[3]
  const qbw = b[0]

  return [
    qaw * qbw - qax * qbx - qay * qby - qaz * qbz,
    qax * qbw + qaw * qbx + qay * qbz - qaz * qby,
    qay * qbw + qaw * qby + qaz * qbx - qax * qbz,
    qaz * qbw + qaw * qbz + qax * qby - qay * qbx,
  ]
}

export const fromEulerAngles = ([x, y, z]: V3): Quaternion => {
  const cos = Math.cos
  const sin = Math.sin

  const c1 = cos(x / 2)
  const c2 = cos(y / 2)
  const c3 = cos(z / 2)

  const s1 = sin(x / 2)
  const s2 = sin(y / 2)
  const s3 = sin(z / 2)

  return [
    c1 * c2 * c3 - s1 * s2 * s3,
    s1 * c2 * c3 + c1 * s2 * s3,
    c1 * s2 * c3 - s1 * c2 * s3,
    c1 * c2 * s3 + s1 * s2 * c3,
  ]
}

export const conjugate = (quaternion: Quaternion): Quaternion => {
  return [quaternion[0], -quaternion[1], -quaternion[2], -quaternion[3]]
}

export const zeroRotation = (): Quaternion => [1, 0, 0, 0]

export const normalize = (quaternion: Quaternion): Quaternion => {
  const length = Math.hypot(...quaternion)
  if (length === 0) return zeroRotation()
  return [quaternion[0] / length, quaternion[1] / length, quaternion[2] / length, quaternion[3] / length]
}

export const clamp = (quaternion: Quaternion, bounds: V3): Quaternion => {
  const [w, ...rotationAxis] = quaternion

  const [x, y, z] = V3O.fromArray(
    rotationAxis.map((component, index) => {
      const angle = 2 * Math.atan(component / w)
      const clampedAngle = MathUtils.clamp(angle, -bounds[index]!, bounds[index]!)
      return Math.tan(0.5 * clampedAngle)
    }),
  )
  return normalize([1, x, y, z])
}