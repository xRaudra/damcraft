'use client'

import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// Register plugins — client-side only (this file is 'use client')
gsap.registerPlugin(ScrollTrigger)

export { gsap, ScrollTrigger }
