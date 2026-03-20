'use client'

import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import WhatsAppButton from '@/components/WhatsAppButton'

type LocationOption = 'Abuja' | 'Lagos'

type RegistrationResponse = {
  success: boolean
  registration: {
    id: string
    fullName: string
    location: string
    headshotUrl: string
  }
}

const GENDERS = ['Female', 'Male', 'Non-binary', 'Prefer not to say'] as const
const YES_NO = ['Yes', 'No'] as const

const toFixed2 = (num: number) => (Number.isFinite(num) ? num.toFixed(2) : '')
const convertCmToIn = (cm: number) => cm / 2.54
const convertInToCm = (inch: number) => inch * 2.54

export default function RegistrationPage() {
  const [selectedLocation, setSelectedLocation] = useState<LocationOption | ''>('')
  const [fullName, setFullName] = useState('')  
  const [age, setAge] = useState('')
  const [dateOfBirth, setDateOfBirth] = useState('')
  const [gender, setGender] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [cityState, setCityState] = useState('')

  const [heightValue, setHeightValue] = useState('')
  const [heightUnit, setHeightUnit] = useState('cm')
  const [weightValue, setWeightValue] = useState('')
  const [weightUnit, setWeightUnit] = useState('kg')
  const [bustChestValue, setBustChestValue] = useState('')
  const [bustChestUnit, setBustChestUnit] = useState('cm')
  const [waistValue, setWaistValue] = useState('')
  const [waistUnit, setWaistUnit] = useState('cm')
  const [hipsValue, setHipsValue] = useState('')
  const [hipsUnit, setHipsUnit] = useState<'cm' | 'in'>('cm')
  const [shoeSize, setShoeSize] = useState('')

  const [hasModelingExperience, setHasModelingExperience] = useState('')
  const [experienceTypes, setExperienceTypes] = useState('')
  const [priorTraining, setPriorTraining] = useState('')
  const [fullSessionAvailability, setFullSessionAvailability] = useState('')

  const [motivation, setMotivation] = useState('')
  const [goals, setGoals] = useState('')
  const [expectedGain, setExpectedGain] = useState('')

  const [instagramHandle, setInstagramHandle] = useState('')
  const [tiktokOrOther, setTiktokOrOther] = useState('')

  const [headshot, setHeadshot] = useState<File | null>(null)
  const [fullBody, setFullBody] = useState<File | null>(null)
  const [walkVideo, setWalkVideo] = useState<File | null>(null)

  const [consentPhotoVideo, setConsentPhotoVideo] = useState('')
  const [referralSource, setReferralSource] = useState('')

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [successData, setSuccessData] = useState<RegistrationResponse['registration'] | null>(null)
  const [generatedCardDataUrl, setGeneratedCardDataUrl] = useState('')
  const [isTicketModalOpen, setIsTicketModalOpen] = useState(false)

  const hipsConverted = useMemo(() => {
    if (!hipsValue) return ''
    const parsed = Number(hipsValue)
    if (!Number.isFinite(parsed)) return ''
    return hipsUnit === 'cm' ? `${toFixed2(convertCmToIn(parsed))} in` : `${toFixed2(convertInToCm(parsed))} cm`
  }, [hipsValue, hipsUnit])

  const isFormReady = useMemo(() => {
    return Boolean(
      selectedLocation &&
        fullName &&
        age &&
        dateOfBirth &&
        gender &&
        phone &&
        email &&
        cityState &&
        heightValue &&
        heightUnit &&
        weightValue &&
        weightUnit &&
        bustChestValue &&
        bustChestUnit &&
        waistValue &&
        waistUnit &&
        hipsValue &&
        hipsUnit &&
        shoeSize &&
        hasModelingExperience &&
        fullSessionAvailability &&
        motivation &&
        goals &&
        expectedGain &&
        consentPhotoVideo &&
        referralSource &&
        headshot &&
        fullBody
    )
  }, [
    selectedLocation,
    fullName,
    age,
    dateOfBirth,
    gender,
    phone,
    email,
    cityState,
    heightValue,
    heightUnit,
    weightValue,
    weightUnit,
    bustChestValue,
    bustChestUnit,
    waistValue,
    waistUnit,
    hipsValue,
    hipsUnit,
    shoeSize,
    hasModelingExperience,
    fullSessionAvailability,
    motivation,
    goals,
    expectedGain,
    consentPhotoVideo,
    referralSource,
    headshot,
    fullBody,
  ])

  const resetStatus = () => {
    setError('')
    setSuccessData(null)
    setGeneratedCardDataUrl('')
    setIsTicketModalOpen(false)
  }

  const createRegistrationCard = async (
    headshotFile: File,
    ticket: {
      regId: string
      personName: string
      gender: string
      location: string
      cityState: string
      phone: string
      age: string
      heightValue: string
      heightUnit: string
      weightValue: string
      weightUnit: string
      bustChestValue: string
      bustChestUnit: string
      waistValue: string
      waistUnit: string
      hipsValue: string
      hipsUnit: string
      hipsConverted: string
      shoeSize: string
    }
  ) => {
    const imageBitmap = await createImageBitmap(headshotFile)
    const canvas = document.createElement('canvas')
    canvas.width = 1400
    canvas.height = 800
    const ctx = canvas.getContext('2d')

    if (!ctx) {
      throw new Error('Could not initialize image renderer.')
    }

    const drawRoundedRect = (x: number, y: number, w: number, h: number, r: number) => {
      const radius = Math.min(r, w / 2, h / 2)
      ctx.beginPath()
      ctx.moveTo(x + radius, y)
      ctx.arcTo(x + w, y, x + w, y + h, radius)
      ctx.arcTo(x + w, y + h, x, y + h, radius)
      ctx.arcTo(x, y + h, x, y, radius)
      ctx.arcTo(x, y, x + w, y, radius)
      ctx.closePath()
    }

    // Draw an image into a rectangle without stretching (like CSS `object-fit: cover`).
    const drawImageCover = (img: ImageBitmap, x: number, y: number, w: number, h: number) => {
      const srcW = img.width
      const srcH = img.height
      const scale = Math.max(w / srcW, h / srcH)
      const sw = w / scale
      const sh = h / scale
      const sx = (srcW - sw) / 2
      const sy = (srcH - sh) / 2
      ctx.drawImage(img, sx, sy, sw, sh, x, y, w, h)
    }

    // Match the monochrome editorial look of the website.
    ctx.fillStyle = '#000000'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height)
    gradient.addColorStop(0, 'rgba(255, 255, 255, 0.09)')
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0)')
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Card frame
    const cardPad = 44
    drawRoundedRect(cardPad, cardPad, canvas.width - cardPad * 2, canvas.height - cardPad * 2, 28)
    ctx.fillStyle = 'rgba(255,255,255,0.02)'
    ctx.fill()
    ctx.strokeStyle = 'rgba(255,255,255,0.14)'
    ctx.lineWidth = 2
    ctx.stroke()

    // Vertical divider
    ctx.fillStyle = 'rgba(255,255,255,0.22)'
    ctx.fillRect(740, 120, 2, canvas.height - 240)

    // Photo block (cover-cropped + framed)
    const photoWidth = 450
    const photoHeight = 520
    const photoX = 140
    const photoY = 140

    // Photo background
    drawRoundedRect(photoX, photoY, photoWidth, photoHeight, 20)
    ctx.fillStyle = 'rgba(255,255,255,0.03)'
    ctx.fill()
    ctx.strokeStyle = 'rgba(255,255,255,0.28)'
    ctx.lineWidth = 2
    ctx.stroke()

    // Clip so image is cropped to the rounded rectangle
    ctx.save()
    drawRoundedRect(photoX, photoY, photoWidth, photoHeight, 20)
    ctx.clip()
    drawImageCover(imageBitmap, photoX, photoY, photoWidth, photoHeight)
    ctx.restore()

    // Header
    ctx.fillStyle = '#FFFFFF'
    ctx.font = '700 84px Georgia, serif'
    ctx.fillText('LAW', 740, 190)

    ctx.fillStyle = 'rgba(255,255,255,0.66)'
    ctx.font = '300 26px Inter, Arial, sans-serif'
    ctx.fillText('MASTERCLASS REGISTRATION', 740, 230)

    // Name block
    ctx.fillStyle = '#FFFFFF'
    ctx.font = '600 44px Georgia, serif'
    ctx.fillText(ticket.personName.toUpperCase(), 740, 330)

    // Details section
    ctx.fillStyle = 'rgba(255,255,255,0.82)'
    ctx.font = '700 22px Inter, Arial, sans-serif'
    ctx.fillText(`REG ID: ${ticket.regId}`, 740, 380)

    ctx.fillStyle = 'rgba(255,255,255,0.70)'
    ctx.font = '300 22px Inter, Arial, sans-serif'
    ctx.fillText(`GENDER: ${ticket.gender}`, 740, 420)
    ctx.fillText(`CITY: ${ticket.cityState}`, 740, 455)
    ctx.fillText(`PHONE: ${ticket.phone}`, 740, 490)
    ctx.fillText(`AGE: ${ticket.age}`, 740, 525)

    // Modeling profile panel
    drawRoundedRect(740, 560, canvas.width - 740 - cardPad, 165, 18)
    ctx.fillStyle = 'rgba(255,255,255,0.03)'
    ctx.fill()
    ctx.strokeStyle = 'rgba(255,255,255,0.12)'
    ctx.lineWidth = 1
    ctx.stroke()

    ctx.fillStyle = '#FFFFFF'
    ctx.font = '700 18px Inter, Arial, sans-serif'
    ctx.fillText('MODELING PROFILE', 780, 590)

    ctx.fillStyle = 'rgba(255,255,255,0.72)'
    ctx.font = '300 18px Inter, Arial, sans-serif'
    ctx.fillText(
      `Height: ${ticket.heightValue} ${ticket.heightUnit.toUpperCase()} | Weight: ${ticket.weightValue} ${ticket.weightUnit.toUpperCase()}`,
      780,
      618
    )
    ctx.fillText(
      `Bust/Chest: ${ticket.bustChestValue} ${ticket.bustChestUnit.toUpperCase()} | Waist: ${ticket.waistValue} ${ticket.waistUnit.toUpperCase()}`,
      780,
      644
    )

    const hipsLine = ticket.hipsConverted
      ? `Hips: ${ticket.hipsValue} ${ticket.hipsUnit.toUpperCase()} (${ticket.hipsConverted})`
      : `Hips: ${ticket.hipsValue} ${ticket.hipsUnit.toUpperCase()}`
    ctx.fillText(hipsLine, 780, 670)
    ctx.fillText(`Shoe Size: ${ticket.shoeSize}`, 780, 695)

    // Footer
    ctx.fillStyle = 'rgba(255,255,255,0.55)'
    ctx.font = '300 18px Inter, Arial, sans-serif'
    ctx.fillText(`MASTERCLASS: ${ticket.location.toUpperCase()} • ${new Date().toLocaleDateString()}`, 740, 760)

    return canvas.toDataURL('image/png')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!headshot || !fullBody || !selectedLocation) return

    setIsSubmitting(true)
    setError('')
    setSuccessData(null)
    setGeneratedCardDataUrl('')

    try {
      const payload = new FormData()
      payload.append('location', selectedLocation)
      payload.append('fullName', fullName)
      payload.append('age', age)
      payload.append('dateOfBirth', dateOfBirth)
      payload.append('gender', gender)
      payload.append('phone', phone)
      payload.append('email', email)
      payload.append('cityState', cityState)

      payload.append('heightValue', heightValue)
      payload.append('heightUnit', heightUnit)
      payload.append('weightValue', weightValue)
      payload.append('weightUnit', weightUnit)
      payload.append('bustChestValue', bustChestValue)
      payload.append('bustChestUnit', bustChestUnit)
      payload.append('waistValue', waistValue)
      payload.append('waistUnit', waistUnit)
      payload.append('hipsValue', hipsValue)
      payload.append('hipsUnit', hipsUnit)
      payload.append('hipsConverted', hipsConverted)
      payload.append('shoeSize', shoeSize)

      payload.append('hasModelingExperience', hasModelingExperience)
      payload.append('experienceTypes', experienceTypes)
      payload.append('priorTraining', priorTraining)

      payload.append('fullSessionAvailability', fullSessionAvailability)

      payload.append('motivation', motivation)
      payload.append('goals', goals)
      payload.append('expectedGain', expectedGain)

      payload.append('instagramHandle', instagramHandle)
      payload.append('tiktokOrOther', tiktokOrOther)

      payload.append('consentPhotoVideo', consentPhotoVideo)
      payload.append('referralSource', referralSource)

      payload.append('headshot', headshot)
      payload.append('fullBody', fullBody)
      if (walkVideo) payload.append('walkVideo', walkVideo)

      const response = await fetch('/api/registration', {
        method: 'POST',
        body: payload,
      })

      const data = (await response.json()) as
        | RegistrationResponse
        | { error: string; details?: string }

      if (!response.ok) {
        const errData = data as { error?: string }
        throw new Error(errData.error || 'Could not complete registration.')
      }

      if (!('success' in data)) {
        throw new Error('Could not complete registration.')
      }

      setSuccessData(data.registration)
      const card = await createRegistrationCard(headshot, {
        regId: data.registration.id,
        personName: data.registration.fullName,
        gender,
        location: data.registration.location,
        cityState,
        phone,
        age,
        heightValue,
        heightUnit,
        weightValue,
        weightUnit,
        bustChestValue,
        bustChestUnit,
        waistValue,
        waistUnit,
        hipsValue,
        hipsUnit,
        hipsConverted,
        shoeSize,
      })
      setGeneratedCardDataUrl(card)
      setIsTicketModalOpen(true)
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Registration failed.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDownloadCard = () => {
    if (!generatedCardDataUrl || !successData) return
    const link = document.createElement('a')
    link.href = generatedCardDataUrl
    link.download = `law-masterclass-${successData.id}.png`
    link.click()
  }

  return (
    <main className="relative">
      <Navigation />
      <WhatsAppButton />

      <section className="relative min-h-[55vh] bg-luxury-black flex items-center justify-center overflow-hidden">
        <div className="container mx-auto px-6 lg:px-16 py-32">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <span className="text-xs text-luxury-white/40 tracking-[0.2em] uppercase ultra-thin-text mb-6 block">
              Limited Seats
            </span>
            <h1 className="editorial-text text-6xl md:text-7xl lg:text-8xl font-bold text-luxury-white mb-8 leading-tight">
              Masterclass Registration
            </h1>
            <p className="text-lg md:text-xl text-luxury-white/70 max-w-3xl mx-auto leading-relaxed thin-text font-light">
              Choose your preferred city and complete your registration.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="relative bg-luxury-white py-28">
        <div className="container mx-auto px-6 lg:px-16 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-10"
          >
            <div>
              <h2 className="editorial-text text-3xl md:text-4xl font-bold text-luxury-black mb-4">
                Select Your Location
              </h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {(['Abuja', 'Lagos'] as const).map((city) => (
                  <button
                    key={city}
                    type="button"
                    onClick={() => {
                      setSelectedLocation(city)
                      resetStatus()
                    }}
                    className={`px-6 py-5 border transition-colors text-left ${
                      selectedLocation === city
                        ? 'bg-luxury-black text-luxury-white border-luxury-black'
                        : 'bg-luxury-white text-luxury-black border-luxury-black/20 hover:border-luxury-black'
                    }`}
                  >
                    <p className="editorial-text text-2xl">{city}</p>
                    <p className={`thin-text text-xs mt-1 ${selectedLocation === city ? 'text-luxury-white/70' : 'text-luxury-black/50'}`}>
                      Attend the {city} masterclass session
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {selectedLocation ? (
              <form onSubmit={handleSubmit} className="space-y-7 border border-luxury-black/10 p-7 md:p-10">
                <h3 className="editorial-text text-3xl text-luxury-black">Registration Form - {selectedLocation}</h3>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="fullName" className="block text-sm text-luxury-black/60 tracking-wider uppercase mb-2 thin-text">
                      Name
                    </label>
                    <input
                      id="fullName"
                      name="fullName"
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full px-4 py-3 bg-luxury-white border border-luxury-black/20 focus:border-luxury-black focus:outline-none"
                    />
                  </div>

                  <div>
                    <label htmlFor="age" className="block text-sm text-luxury-black/60 tracking-wider uppercase mb-2 thin-text">
                      Age
                    </label>
                    <input
                      id="age"
                      name="age"
                      type="number"
                      min={10}
                      max={90}
                      required
                      value={age}
                      onChange={(e) => setAge(e.target.value)}
                      className="w-full px-4 py-3 bg-luxury-white border border-luxury-black/20 focus:border-luxury-black focus:outline-none"
                    />
                  </div>
                  <div>
                    <label htmlFor="dateOfBirth" className="block text-sm text-luxury-black/60 tracking-wider uppercase mb-2 thin-text">
                      Date Of Birth
                    </label>
                    <input
                      id="dateOfBirth"
                      name="dateOfBirth"
                      type="date"
                      required
                      value={dateOfBirth}
                      onChange={(e) => setDateOfBirth(e.target.value)}
                      className="w-full px-4 py-3 bg-luxury-white border border-luxury-black/20 focus:border-luxury-black focus:outline-none"
                    />
                  </div>
                  <div>
                    <label htmlFor="gender" className="block text-sm text-luxury-black/60 tracking-wider uppercase mb-2 thin-text">
                      Gender
                    </label>
                    <select
                      id="gender"
                      name="gender"
                      required
                      value={gender}
                      onChange={(e) => setGender(e.target.value)}
                      className="w-full px-4 py-3 bg-luxury-white border border-luxury-black/20 focus:border-luxury-black focus:outline-none"
                    >
                      <option value="">Select</option>
                      {GENDERS.map((entry) => (
                        <option key={entry} value={entry}>
                          {entry}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm text-luxury-black/60 tracking-wider uppercase mb-2 thin-text">
                      Phone Number (WhatsApp Preferred)
                    </label>
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-4 py-3 bg-luxury-white border border-luxury-black/20 focus:border-luxury-black focus:outline-none"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm text-luxury-black/60 tracking-wider uppercase mb-2 thin-text">
                      Email
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-3 bg-luxury-white border border-luxury-black/20 focus:border-luxury-black focus:outline-none"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label htmlFor="cityState" className="block text-sm text-luxury-black/60 tracking-wider uppercase mb-2 thin-text">
                      Residential City & State
                    </label>
                    <input
                      id="cityState"
                      name="cityState"
                      type="text"
                      required
                      value={cityState}
                      onChange={(e) => setCityState(e.target.value)}
                      className="w-full px-4 py-3 bg-luxury-white border border-luxury-black/20 focus:border-luxury-black focus:outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-5">
                  <h4 className="editorial-text text-2xl text-luxury-black">Modeling Profile</h4>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm text-luxury-black/60 tracking-wider uppercase mb-2 thin-text">Height</label>
                      <div className="flex gap-2">
                        <input type="number" required value={heightValue} onChange={(e) => setHeightValue(e.target.value)} className="w-full px-4 py-3 bg-luxury-white border border-luxury-black/20 focus:border-luxury-black focus:outline-none" />
                        <select value={heightUnit} onChange={(e) => setHeightUnit(e.target.value)} className="px-3 py-3 bg-luxury-white border border-luxury-black/20">
                          <option value="cm">cm</option>
                          <option value="in">in</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm text-luxury-black/60 tracking-wider uppercase mb-2 thin-text">Weight</label>
                      <div className="flex gap-2">
                        <input type="number" required value={weightValue} onChange={(e) => setWeightValue(e.target.value)} className="w-full px-4 py-3 bg-luxury-white border border-luxury-black/20 focus:border-luxury-black focus:outline-none" />
                        <select value={weightUnit} onChange={(e) => setWeightUnit(e.target.value)} className="px-3 py-3 bg-luxury-white border border-luxury-black/20">
                          <option value="kg">kg</option>
                          <option value="lb">lb</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm text-luxury-black/60 tracking-wider uppercase mb-2 thin-text">Bust / Chest</label>
                      <div className="flex gap-2">
                        <input type="number" required value={bustChestValue} onChange={(e) => setBustChestValue(e.target.value)} className="w-full px-4 py-3 bg-luxury-white border border-luxury-black/20 focus:border-luxury-black focus:outline-none" />
                        <select value={bustChestUnit} onChange={(e) => setBustChestUnit(e.target.value)} className="px-3 py-3 bg-luxury-white border border-luxury-black/20">
                          <option value="cm">cm</option>
                          <option value="in">in</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm text-luxury-black/60 tracking-wider uppercase mb-2 thin-text">Waist</label>
                      <div className="flex gap-2">
                        <input type="number" required value={waistValue} onChange={(e) => setWaistValue(e.target.value)} className="w-full px-4 py-3 bg-luxury-white border border-luxury-black/20 focus:border-luxury-black focus:outline-none" />
                        <select value={waistUnit} onChange={(e) => setWaistUnit(e.target.value)} className="px-3 py-3 bg-luxury-white border border-luxury-black/20">
                          <option value="cm">cm</option>
                          <option value="in">in</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm text-luxury-black/60 tracking-wider uppercase mb-2 thin-text">Hips</label>
                      <div className="flex gap-2">
                        <input type="number" required value={hipsValue} onChange={(e) => setHipsValue(e.target.value)} className="w-full px-4 py-3 bg-luxury-white border border-luxury-black/20 focus:border-luxury-black focus:outline-none" />
                        <select value={hipsUnit} onChange={(e) => setHipsUnit(e.target.value as 'cm' | 'in')} className="px-3 py-3 bg-luxury-white border border-luxury-black/20">
                          <option value="cm">cm</option>
                          <option value="in">in</option>
                        </select>
                      </div>
                      <p className="thin-text text-xs text-luxury-black/60 mt-2">Auto conversion: {hipsConverted || '-'}</p>
                    </div>
                    <div>
                      <label htmlFor="shoeSize" className="block text-sm text-luxury-black/60 tracking-wider uppercase mb-2 thin-text">Shoe Size</label>
                      <input id="shoeSize" type="text" required value={shoeSize} onChange={(e) => setShoeSize(e.target.value)} className="w-full px-4 py-3 bg-luxury-white border border-luxury-black/20 focus:border-luxury-black focus:outline-none" />
                    </div>
                  </div>
                </div>

                <div className="space-y-5">
                  <h4 className="editorial-text text-2xl text-luxury-black">Experience</h4>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm text-luxury-black/60 tracking-wider uppercase mb-2 thin-text">Any modeling experience?</label>
                      <select value={hasModelingExperience} onChange={(e) => setHasModelingExperience(e.target.value)} required className="w-full px-4 py-3 bg-luxury-white border border-luxury-black/20 focus:border-luxury-black focus:outline-none">
                        <option value="">Select</option>
                        {YES_NO.map((entry) => <option key={entry} value={entry}>{entry}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm text-luxury-black/60 tracking-wider uppercase mb-2 thin-text">Attended training before?</label>
                      <input type="text" value={priorTraining} onChange={(e) => setPriorTraining(e.target.value)} placeholder="Yes/No + details" className="w-full px-4 py-3 bg-luxury-white border border-luxury-black/20 focus:border-luxury-black focus:outline-none" />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm text-luxury-black/60 tracking-wider uppercase mb-2 thin-text">If yes, specify type(s)</label>
                      <textarea rows={3} value={experienceTypes} onChange={(e) => setExperienceTypes(e.target.value)} placeholder="Runway, Commercial, Editorial, Pageants..." className="w-full px-4 py-3 bg-luxury-white border border-luxury-black/20 focus:border-luxury-black focus:outline-none" />
                    </div>
                  </div>
                </div>

                <div className="space-y-5">
                  <h4 className="editorial-text text-2xl text-luxury-black">Availability</h4>
                  <select value={fullSessionAvailability} onChange={(e) => setFullSessionAvailability(e.target.value)} required className="w-full md:w-72 px-4 py-3 bg-luxury-white border border-luxury-black/20 focus:border-luxury-black focus:outline-none">
                    <option value="">Full session availability?</option>
                    {YES_NO.map((entry) => <option key={entry} value={entry}>{entry}</option>)}
                  </select>
                </div>

                <div className="space-y-5">
                  <h4 className="editorial-text text-2xl text-luxury-black">Motivation & Goals</h4>
                  <textarea rows={3} required value={motivation} onChange={(e) => setMotivation(e.target.value)} placeholder="Why do you want to join LawModelsAcademy?" className="w-full px-4 py-3 bg-luxury-white border border-luxury-black/20 focus:border-luxury-black focus:outline-none" />
                  <textarea rows={3} required value={goals} onChange={(e) => setGoals(e.target.value)} placeholder="What are your modeling goals?" className="w-full px-4 py-3 bg-luxury-white border border-luxury-black/20 focus:border-luxury-black focus:outline-none" />
                  <textarea rows={3} required value={expectedGain} onChange={(e) => setExpectedGain(e.target.value)} placeholder="What do you hope to gain from this masterclass?" className="w-full px-4 py-3 bg-luxury-white border border-luxury-black/20 focus:border-luxury-black focus:outline-none" />
                </div>

                <div className="space-y-5">
                  <h4 className="editorial-text text-2xl text-luxury-black">Social Media (Optional)</h4>
                  <div className="grid md:grid-cols-2 gap-6">
                    <input type="text" value={instagramHandle} onChange={(e) => setInstagramHandle(e.target.value)} placeholder="Instagram handle" className="w-full px-4 py-3 bg-luxury-white border border-luxury-black/20 focus:border-luxury-black focus:outline-none" />
                    <input type="text" value={tiktokOrOther} onChange={(e) => setTiktokOrOther(e.target.value)} placeholder="TikTok / other platform" className="w-full px-4 py-3 bg-luxury-white border border-luxury-black/20 focus:border-luxury-black focus:outline-none" />
                  </div>
                </div>

                <div className="space-y-5">
                  <h4 className="editorial-text text-2xl text-luxury-black">Uploads</h4>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm text-luxury-black/60 tracking-wider uppercase mb-2 thin-text">Headshot (No makeup preferred)</label>
                      <input type="file" accept="image/*" required onChange={(e) => setHeadshot(e.target.files?.[0] ?? null)} className="w-full px-4 py-3 bg-luxury-white border border-luxury-black/20 focus:border-luxury-black focus:outline-none file:mr-4 file:py-2 file:px-4 file:border-0 file:text-sm file:font-light file:bg-luxury-black file:text-luxury-white file:cursor-pointer" />
                    </div>
                    <div>
                      <label className="block text-sm text-luxury-black/60 tracking-wider uppercase mb-2 thin-text">Full Body Photo</label>
                      <input type="file" accept="image/*" required onChange={(e) => setFullBody(e.target.files?.[0] ?? null)} className="w-full px-4 py-3 bg-luxury-white border border-luxury-black/20 focus:border-luxury-black focus:outline-none file:mr-4 file:py-2 file:px-4 file:border-0 file:text-sm file:font-light file:bg-luxury-black file:text-luxury-white file:cursor-pointer" />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm text-luxury-black/60 tracking-wider uppercase mb-2 thin-text">Walk Video (Optional)</label>
                      <input type="file" accept="video/*" onChange={(e) => setWalkVideo(e.target.files?.[0] ?? null)} className="w-full px-4 py-3 bg-luxury-white border border-luxury-black/20 focus:border-luxury-black focus:outline-none file:mr-4 file:py-2 file:px-4 file:border-0 file:text-sm file:font-light file:bg-luxury-black file:text-luxury-white file:cursor-pointer" />
                    </div>
                  </div>
                </div>

                <div className="space-y-5">
                  <h4 className="editorial-text text-2xl text-luxury-black">Consent</h4>
                  <div className="grid md:grid-cols-2 gap-6">
                    <select value={consentPhotoVideo} onChange={(e) => setConsentPhotoVideo(e.target.value)} required className="w-full px-4 py-3 bg-luxury-white border border-luxury-black/20 focus:border-luxury-black focus:outline-none">
                      <option value="">Agree to be photographed/recorded?</option>
                      {YES_NO.map((entry) => <option key={entry} value={entry}>{entry}</option>)}
                    </select>
                    <input type="text" required value={referralSource} onChange={(e) => setReferralSource(e.target.value)} placeholder="How did you hear about LawModelsAcademy?" className="w-full px-4 py-3 bg-luxury-white border border-luxury-black/20 focus:border-luxury-black focus:outline-none" />
                  </div>
                </div>

                {error ? <p className="text-red-600 thin-text text-sm">{error}</p> : null}

                <motion.button
                  type="submit"
                  disabled={!isFormReady || isSubmitting}
                  whileHover={{ scale: isFormReady && !isSubmitting ? 1.02 : 1 }}
                  whileTap={{ scale: isFormReady && !isSubmitting ? 0.98 : 1 }}
                  className="w-full md:w-auto px-10 py-4 bg-luxury-black text-luxury-white editorial-text text-lg tracking-wider uppercase disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Submitting...' : 'Complete Registration'}
                </motion.button>
              </form>
            ) : (
              <div className="border border-dashed border-luxury-black/30 p-8 text-center text-luxury-black/60 thin-text">
                Select Abuja or Lagos to open the registration form.
              </div>
            )}

            {successData && generatedCardDataUrl ? (
              <div className="hidden" aria-hidden="true">
                {/* Ticket is shown in a popup modal */}
              </div>
            ) : null}
          </motion.div>
        </div>
      </section>

      {isTicketModalOpen && successData && generatedCardDataUrl ? (
        <div
          className="fixed inset-0 z-[200] bg-black/70 flex items-center justify-center p-6"
          role="dialog"
          aria-modal="true"
          aria-label="Registration ticket modal"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) setIsTicketModalOpen(false)
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="w-full max-w-3xl bg-luxury-white border border-luxury-black/20 p-6 md:p-10 space-y-5"
          >
            <div className="space-y-2">
              <p className="editorial-text text-3xl text-luxury-black">Your Ticket</p>
              <p className="thin-text text-luxury-black/70">
                Registration ID: <span className="font-medium">{successData.id}</span>
              </p>
            </div>

            <div className="relative w-full aspect-[16/9] border border-luxury-black/20 bg-luxury-white">
              <Image src={generatedCardDataUrl} alt="Generated registration ticket" fill className="object-cover" unoptimized />
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-end">
              <button
                type="button"
                onClick={() => setIsTicketModalOpen(false)}
                className="px-8 py-3 border border-luxury-black/30 text-luxury-black thin-text tracking-wider uppercase"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  handleDownloadCard()
                  setIsTicketModalOpen(false)
                }}
                className="px-8 py-3 bg-luxury-black text-luxury-white thin-text tracking-wider uppercase"
              >
                Download Ticket
              </button>
            </div>
          </motion.div>
        </div>
      ) : null}

      <Footer />
    </main>
  )
}
