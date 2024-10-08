import { Photo } from "./photo"


export interface Member {
    id: number
    userName: string
    photoUrl: string
    age: number
    knownAs: string
    created: Date
    lastActive: Date
    gender: string
    introduction: string
    interests: string
    country: string
    city: string
    photos: Photo[]
    lookingFor: string
  }
  
