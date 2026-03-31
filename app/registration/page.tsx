'use client'

import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import WhatsAppButton from '@/components/WhatsAppButton'
import { getSupabaseBrowser } from '@/lib/supabaseBrowser'

type LocationOption = 'Abuja' | 'Lagos'

type RegistrationResponse = {
  success: boolean
  registration: {
    id: string
    regNumber: number
    fullName: string
    location: string
    headshotUrl: string
  }
}

const GENDERS = ['Female', 'Male', 'Non-binary', 'Prefer not to say'] as const
const YES_NO = ['Yes', 'No'] as const
const PLAN_TYPES = ['standard', 'custom'] as const
const SCHOLARSHIP_TYPES = ['none', 'percentage', 'full'] as const
const LOCATION_MODES = ['online', 'lagos', 'abuja', 'custom'] as const
const MASTERCLASS_ADDRESS: Record<LocationOption, string> = {
  Lagos: '2 Otunubi Street Ogba Ifako Road Lagos',
  Abuja: 'MTF 6, Paradise Estate Phase 2 Lifecamp',
}

const toFixed2 = (num: number) => (Number.isFinite(num) ? num.toFixed(2) : '')
const convertCmToIn = (cm: number) => cm / 2.54
const convertInToCm = (inch: number) => inch * 2.54
const convertKgToLb = (kg: number) => kg * 2.20462
const convertLbToKg = (lb: number) => lb / 2.20462
const convertInToFtIn = (inch: number) => {
  const feet = Math.floor(inch / 12)
  const remainingInches = inch - feet * 12
  return `${feet}ft ${toFixed2(remainingInches)}in`
}

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
  const [enrollmentTracks, setEnrollmentTracks] = useState<string[]>([])
  const [planType, setPlanType] = useState<(typeof PLAN_TYPES)[number]>('standard')
  const [customPlanName, setCustomPlanName] = useState('')
  const [totalDue, setTotalDue] = useState('')
  const [amountPaid, setAmountPaid] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [monthlyEnabled, setMonthlyEnabled] = useState(false)
  const [monthlyAmount, setMonthlyAmount] = useState('')
  const [scholarshipType, setScholarshipType] = useState<(typeof SCHOLARSHIP_TYPES)[number]>('none')
  const [scholarshipPercent, setScholarshipPercent] = useState('')
  const [locationMode, setLocationMode] = useState<(typeof LOCATION_MODES)[number]>('custom')
  const [customLocationText, setCustomLocationText] = useState('')

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

  const heightConverted = useMemo(() => {
    if (!heightValue) return ''
    const parsed = Number(heightValue)
    if (!Number.isFinite(parsed)) return ''
    if (heightUnit === 'cm') {
      const inches = convertCmToIn(parsed)
      return `${toFixed2(inches)} in (${convertInToFtIn(inches)})`
    }
    const cm = convertInToCm(parsed)
    return `${toFixed2(cm)} cm (${convertInToFtIn(parsed)})`
  }, [heightValue, heightUnit])

  const weightConverted = useMemo(() => {
    if (!weightValue) return ''
    const parsed = Number(weightValue)
    if (!Number.isFinite(parsed)) return ''
    return weightUnit === 'kg' ? `${toFixed2(convertKgToLb(parsed))} lb` : `${toFixed2(convertLbToKg(parsed))} kg`
  }, [weightValue, weightUnit])

  const bustChestConverted = useMemo(() => {
    if (!bustChestValue) return ''
    const parsed = Number(bustChestValue)
    if (!Number.isFinite(parsed)) return ''
    return bustChestUnit === 'cm' ? `${toFixed2(convertCmToIn(parsed))} in` : `${toFixed2(convertInToCm(parsed))} cm`
  }, [bustChestValue, bustChestUnit])

  const waistConverted = useMemo(() => {
    if (!waistValue) return ''
    const parsed = Number(waistValue)
    if (!Number.isFinite(parsed)) return ''
    return waistUnit === 'cm' ? `${toFixed2(convertCmToIn(parsed))} in` : `${toFixed2(convertInToCm(parsed))} cm`
  }, [waistValue, waistUnit])

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

  const toggleTrack = (track: string) => {
    setEnrollmentTracks((prev) => (prev.includes(track) ? prev.filter((item) => item !== track) : [...prev, track]))
  }

  const createRegistrationCard = async (
    headshotFile: File,
    ticket: {
      regNumber: number
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
      address: string
    }
  ) => {
    const imageBitmap = await createImageBitmap(headshotFile)

    const W = 1600
    const H = 1020
    const canvas = document.createElement('canvas')
    canvas.width = W
    canvas.height = H
    const ctx = canvas.getContext('2d')
    if (!ctx) throw new Error('Could not initialize image renderer.')

    const roundRect = (x: number, y: number, w: number, h: number, r: number) => {
      const rad = Math.min(r, w / 2, h / 2)
      ctx.beginPath()
      ctx.moveTo(x + rad, y)
      ctx.arcTo(x + w, y, x + w, y + h, rad)
      ctx.arcTo(x + w, y + h, x, y + h, rad)
      ctx.arcTo(x, y + h, x, y, rad)
      ctx.arcTo(x, y, x + w, y, rad)
      ctx.closePath()
    }

    const drawCover = (img: ImageBitmap, x: number, y: number, w: number, h: number) => {
      const scale = Math.max(w / img.width, h / img.height)
      const sw = w / scale
      const sh = h / scale
      const sx = (img.width - sw) / 2
      const sy = (img.height - sh) / 2
      ctx.drawImage(img, sx, sy, sw, sh, x, y, w, h)
    }

    const fitText = (text: string, maxW: number): string => {
      if (ctx.measureText(text).width <= maxW) return text
      let t = text
      while (ctx.measureText(`${t}…`).width > maxW && t.length > 1) t = t.slice(0, -1)
      return `${t}…`
    }

    const fillFitted = (text: string, x: number, y: number, maxW: number) => {
      ctx.fillText(fitText(text, maxW), x, y)
    }

    const hRule = (x: number, y: number, w: number, alpha = 0.14) => {
      ctx.save()
      ctx.strokeStyle = `rgba(255,255,255,${alpha})`
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.moveTo(x, y)
      ctx.lineTo(x + w, y)
      ctx.stroke()
      ctx.restore()
    }

    const detail = (
      label: string,
      value: string,
      x: number,
      y: number,
      w: number,
      accent = false
    ) => {
      ctx.font = '600 10px "Courier New", monospace'
      ctx.fillStyle = accent ? 'rgba(255,255,255,0.76)' : 'rgba(255,255,255,0.52)'
      ctx.fillText(label, x, y)
      ctx.font = '500 19px "Times New Roman", Georgia, serif'
      ctx.fillStyle = accent ? '#FFFFFF' : 'rgba(255,255,255,0.92)'
      fillFitted(value, x, y + 26, w)
    }

    ctx.fillStyle = 'rgb(13,13,13)'
    ctx.fillRect(0, 0, W, H)

    ctx.save()
    ctx.globalAlpha = 0.015
    for (let i = 0; i < 3000; i += 1) {
      ctx.fillStyle = '#FFFFFF'
      ctx.fillRect(Math.random() * W, Math.random() * H, 1, 1)
    }
    ctx.restore()

    const PAD = 34
    roundRect(PAD, PAD, W - PAD * 2, H - PAD * 2, 24)
    ctx.fillStyle = 'rgba(13,13,13,0.92)'
    ctx.fill()
    ctx.strokeStyle = 'rgba(255,255,255,0.14)'
    ctx.lineWidth = 1.2
    ctx.stroke()

    const photoX = 74
    const photoY = 74
    const photoW = 520
    const photoH = H - 148

    roundRect(photoX, photoY, photoW, photoH, 20)
    ctx.fillStyle = 'rgba(255,255,255,0.04)'
    ctx.fill()
    ctx.strokeStyle = 'rgba(255,255,255,0.34)'
    ctx.lineWidth = 1.4
    ctx.stroke()

    ctx.save()
    roundRect(photoX, photoY, photoW, photoH, 20)
    ctx.clip()
    drawCover(imageBitmap, photoX, photoY, photoW, photoH)
    const vignette = ctx.createRadialGradient(
      photoX + photoW / 2,
      photoY + photoH * 0.4,
      photoH * 0.16,
      photoX + photoW / 2,
      photoY + photoH / 2,
      photoH * 0.85
    )
    vignette.addColorStop(0, 'rgba(0,0,0,0)')
    vignette.addColorStop(1, 'rgba(0,0,0,0.58)')
    ctx.fillStyle = vignette
    ctx.fillRect(photoX, photoY, photoW, photoH)
    ctx.restore()

    ctx.fillStyle = 'rgba(210,210,210,0.82)'
    ctx.fillRect(photoX + 18, photoY + photoH - 14, photoW - 36, 4)

    const panelX = photoX + photoW + 54
    const panelW = W - panelX - 74
    let y = 92

    roundRect(panelX - 18, photoY, panelW + 18, photoH, 20)
    ctx.fillStyle = 'rgba(20,20,20,0.52)'
    ctx.fill()
    ctx.strokeStyle = 'rgba(255,255,255,0.08)'
    ctx.stroke()

    ctx.font = '500 11px "Courier New", monospace'
    ctx.fillStyle = 'rgba(255,255,255,0.72)'
    ctx.fillText('LAW MODELS ACADEMY / MASTERCLASS PASS', panelX, y)
    y += 18

    hRule(panelX, y, panelW, 0.2)
    y += 74

    ctx.font = '800 96px Georgia, "Times New Roman", serif'
    ctx.fillStyle = '#FFFFFF'
    ctx.fillText('LAW', panelX, y)
    y += 34

    ctx.font = '400 18px "Courier New", monospace'
    ctx.fillStyle = 'rgba(255,255,255,0.78)'
    ctx.fillText('MASTERCLASS CREDENTIAL', panelX + 5, y)
    y += 58

    hRule(panelX, y, panelW, 0.16)
    y += 50

    ctx.font = '700 47px Georgia, "Times New Roman", serif'
    ctx.fillStyle = '#FFFFFF'
    const nameUpper = ticket.personName.toUpperCase()
    fillFitted(nameUpper, panelX, y, panelW)
    const nameW = Math.min(ctx.measureText(nameUpper).width, panelW)
    y += 15

    ctx.save()
    ctx.strokeStyle = 'rgba(255,255,255,0.72)'
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(panelX, y)
    ctx.lineTo(panelX + nameW, y)
    ctx.stroke()
    ctx.restore()
    y += 42

    const regNo = String(ticket.regNumber).padStart(8, '0')
    const col2 = panelX + panelW / 2 + 10
    const halfW = panelW / 2 - 18
    const rowGap = 56

    detail('REG NUMBER', `#${regNo}`, panelX, y, halfW, true)
    detail('LOCATION', ticket.location.toUpperCase(), col2, y, halfW)
    y += rowGap

    detail('AGE', ticket.age, panelX, y, halfW)
    detail('GENDER', ticket.gender, col2, y, halfW)
    y += rowGap

    detail('CITY / STATE', ticket.cityState, panelX, y, panelW)
    y += rowGap

    detail('PHONE', ticket.phone, panelX, y, panelW)
    y += 56

    hRule(panelX, y, panelW, 0.14)
    y += 28

    ctx.font = '600 11px "Courier New", monospace'
    ctx.fillStyle = 'rgba(255,255,255,0.74)'
    ctx.fillText('MODEL PROFILE MATRIX', panelX, y)
    y += 20

    const matrixH = 184
    roundRect(panelX, y, panelW, matrixH, 14)
    ctx.fillStyle = 'rgba(255,255,255,0.03)'
    ctx.fill()
    ctx.strokeStyle = 'rgba(255,255,255,0.09)'
    ctx.lineWidth = 1
    ctx.stroke()

    const statCols = 3
    const statW = panelW / statCols
    const stats = [
      { label: 'HEIGHT', value: `${ticket.heightValue} ${ticket.heightUnit.toUpperCase()}` },
      { label: 'WEIGHT', value: `${ticket.weightValue} ${ticket.weightUnit.toUpperCase()}` },
      { label: 'SHOE SIZE', value: ticket.shoeSize },
      { label: 'BUST/CHEST', value: `${ticket.bustChestValue} ${ticket.bustChestUnit.toUpperCase()}` },
      { label: 'WAIST', value: `${ticket.waistValue} ${ticket.waistUnit.toUpperCase()}` },
      { label: 'HIPS', value: `${ticket.hipsValue} ${ticket.hipsUnit.toUpperCase()}` },
    ]

    stats.forEach((s, i) => {
      const col = i % statCols
      const row = Math.floor(i / statCols)
      const sx = panelX + col * statW + 18
      const sy = y + 42 + row * 72

      ctx.font = '700 24px Georgia, "Times New Roman", serif'
      ctx.fillStyle = '#FFFFFF'
      fillFitted(s.value, sx, sy, statW - 28)

      ctx.font = '500 10px "Courier New", monospace'
      ctx.fillStyle = 'rgba(220,220,220,0.72)'
      ctx.fillText(s.label, sx, sy + 18)
    })

    for (let c = 1; c < statCols; c++) {
      ctx.save()
      ctx.strokeStyle = 'rgba(255,255,255,0.07)'
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.moveTo(panelX + c * statW, y + 16)
      ctx.lineTo(panelX + c * statW, y + matrixH - 16)
      ctx.stroke()
      ctx.restore()
    }

    y += matrixH + 34

    hRule(panelX, y, panelW, 0.1)
    y += 24

    ctx.font = '400 13px "Courier New", monospace'
    ctx.fillStyle = 'rgba(255,255,255,0.42)'
    fillFitted(
      `MASTERCLASS: ${ticket.location.toUpperCase()}  •  ${new Date()
        .toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
        .toUpperCase()}`,
      panelX,
      y,
      panelW
    )
    y += 26

    ctx.font = '400 13px "Courier New", monospace'
    ctx.fillStyle = 'rgba(230,230,230,0.52)'
    fillFitted(`VENUE: ${ticket.address}`, panelX, y, panelW)

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
      payload.append('enrollmentTracks', enrollmentTracks.join(','))
      payload.append('planType', planType)
      payload.append('customPlanName', customPlanName)
      payload.append('totalDue', totalDue)
      payload.append('amountPaid', amountPaid)
      payload.append('dueDate', dueDate)
      payload.append('monthlyEnabled', monthlyEnabled ? 'true' : 'false')
      payload.append('monthlyAmount', monthlyAmount)
      payload.append('scholarshipType', scholarshipType)
      payload.append('scholarshipPercent', scholarshipPercent)
      payload.append('locationMode', locationMode)
      payload.append('customLocationText', customLocationText)

      payload.append('headshot', headshot)
      payload.append('fullBody', fullBody)
      if (walkVideo) payload.append('walkVideo', walkVideo)

      const supabase = getSupabaseBrowser()
      const sessionRes = supabase ? await supabase.auth.getSession() : null
      const accessToken = sessionRes?.data.session?.access_token ?? null

      const response = await fetch('/api/registration', {
        method: 'POST',
        headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : undefined,
        body: payload,
      })

      const data = (await response.json()) as
        | RegistrationResponse
        | { error?: string; details?: string }

      if (!response.ok) {
        const errData = data as { error?: string; details?: string }
        const baseMessage = errData.error || 'Could not complete registration.'
        const detailsMessage = errData.details ? ` Details: ${errData.details}` : ''
        throw new Error(`${baseMessage}${detailsMessage}`)
      }

      if (!('success' in data)) {
        throw new Error('Could not complete registration.')
      }

      setSuccessData(data.registration)
      const card = await createRegistrationCard(headshot, {
        regNumber: data.registration.regNumber,
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
        address: MASTERCLASS_ADDRESS[data.registration.location as LocationOption] ?? cityState,
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
              Free 1-Week Masterclass
            </span>
            <h1 className="editorial-text text-6xl md:text-7xl lg:text-8xl font-bold text-luxury-white mb-8 leading-tight">
              Masterclass Registration
            </h1>
            <p className="text-lg md:text-xl text-luxury-white/70 max-w-3xl mx-auto leading-relaxed thin-text font-light">
              Free one-week masterclass with scouting and training. All heights, ages, and sizes are welcome.
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
                      {`Attend the ${city} free 1-week masterclass`}
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
                      <p className="thin-text text-xs text-luxury-black/60 mt-2">Auto conversion: {heightConverted || '-'}</p>
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
                      <p className="thin-text text-xs text-luxury-black/60 mt-2">Auto conversion: {weightConverted || '-'}</p>
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
                      <p className="thin-text text-xs text-luxury-black/60 mt-2">Auto conversion: {bustChestConverted || '-'}</p>
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
                      <p className="thin-text text-xs text-luxury-black/60 mt-2">Auto conversion: {waistConverted || '-'}</p>
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
                  <h4 className="editorial-text text-2xl text-luxury-black">Student Plan & Enrollment</h4>
                  <div className="space-y-3">
                    <p className="block text-sm text-luxury-black/60 tracking-wider uppercase thin-text">Enrollment tracks</p>
                    <div className="flex flex-wrap gap-2">
                      {['catwalk', 'online', 'both', 'portfolio_editorial'].map((track) => {
                        const active = enrollmentTracks.includes(track)
                        return (
                          <button
                            key={track}
                            type="button"
                            onClick={() => toggleTrack(track)}
                            className={`px-3 py-2 border text-xs uppercase tracking-wider thin-text ${
                              active ? 'bg-luxury-black text-luxury-white border-luxury-black' : 'border-luxury-black/20 text-luxury-black'
                            }`}
                          >
                            {track.replace('_', '/')}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm text-luxury-black/60 tracking-wider uppercase mb-2 thin-text">Plan Type</label>
                      <select value={planType} onChange={(e) => setPlanType(e.target.value as (typeof PLAN_TYPES)[number])} className="w-full px-4 py-3 bg-luxury-white border border-luxury-black/20 focus:border-luxury-black focus:outline-none">
                        {PLAN_TYPES.map((entry) => <option key={entry} value={entry}>{entry}</option>)}
                      </select>
                    </div>
                    <input value={customPlanName} onChange={(e) => setCustomPlanName(e.target.value)} placeholder="Custom plan name (optional)" className="w-full px-4 py-3 bg-luxury-white border border-luxury-black/20 focus:border-luxury-black focus:outline-none" />
                    <input value={totalDue} onChange={(e) => setTotalDue(e.target.value)} placeholder="Total due (NGN)" className="w-full px-4 py-3 bg-luxury-white border border-luxury-black/20 focus:border-luxury-black focus:outline-none" />
                    <input value={amountPaid} onChange={(e) => setAmountPaid(e.target.value)} placeholder="Amount paid (NGN)" className="w-full px-4 py-3 bg-luxury-white border border-luxury-black/20 focus:border-luxury-black focus:outline-none" />
                    <div>
                      <label className="block text-sm text-luxury-black/60 tracking-wider uppercase mb-2 thin-text">Scholarship type</label>
                      <select value={scholarshipType} onChange={(e) => setScholarshipType(e.target.value as (typeof SCHOLARSHIP_TYPES)[number])} className="w-full px-4 py-3 bg-luxury-white border border-luxury-black/20 focus:border-luxury-black focus:outline-none">
                        {SCHOLARSHIP_TYPES.map((entry) => <option key={entry} value={entry}>{entry}</option>)}
                      </select>
                    </div>
                    <input value={scholarshipPercent} onChange={(e) => setScholarshipPercent(e.target.value)} placeholder="Scholarship percent (if percentage)" className="w-full px-4 py-3 bg-luxury-white border border-luxury-black/20 focus:border-luxury-black focus:outline-none" />
                    <div>
                      <label className="block text-sm text-luxury-black/60 tracking-wider uppercase mb-2 thin-text">Due date</label>
                      <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className="w-full px-4 py-3 bg-luxury-white border border-luxury-black/20 focus:border-luxury-black focus:outline-none" />
                    </div>
                    <div>
                      <label className="block text-sm text-luxury-black/60 tracking-wider uppercase mb-2 thin-text">Location mode</label>
                      <select value={locationMode} onChange={(e) => setLocationMode(e.target.value as (typeof LOCATION_MODES)[number])} className="w-full px-4 py-3 bg-luxury-white border border-luxury-black/20 focus:border-luxury-black focus:outline-none">
                        {LOCATION_MODES.map((entry) => <option key={entry} value={entry}>{entry}</option>)}
                      </select>
                    </div>
                    <input value={customLocationText} onChange={(e) => setCustomLocationText(e.target.value)} placeholder="Custom location text (optional)" className="md:col-span-2 w-full px-4 py-3 bg-luxury-white border border-luxury-black/20 focus:border-luxury-black focus:outline-none" />
                    <label className="md:col-span-2 flex items-center gap-2 thin-text text-luxury-black">
                      <input type="checkbox" checked={monthlyEnabled} onChange={(e) => setMonthlyEnabled(e.target.checked)} />
                      Enable monthly installment
                    </label>
                    {monthlyEnabled ? (
                      <input value={monthlyAmount} onChange={(e) => setMonthlyAmount(e.target.value)} placeholder="Monthly amount (NGN)" className="md:col-span-2 w-full px-4 py-3 bg-luxury-white border border-luxury-black/20 focus:border-luxury-black focus:outline-none" />
                    ) : null}
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
                Reg Number: <span className="font-medium">{String(successData.regNumber).padStart(8, '0')}</span>
              </p>
              <p className="thin-text text-luxury-black/70">
                Venue:{' '}
                <span className="font-medium">
                  {MASTERCLASS_ADDRESS[successData.location as LocationOption] ?? successData.location}
                </span>
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
