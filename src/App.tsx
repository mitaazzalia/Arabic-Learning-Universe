import { useEffect, useMemo, useState } from 'react'
import {
  Award, CheckCircle2, ChevronRight, Compass, Flame, GraduationCap,
  House, Library, Map, Moon, School, ShoppingBag, Sparkles, Star,
  Train, Trees, Trophy, Utensils, Waves, HeartPulse, Globe2, Menu, X, Zap,
} from 'lucide-react'
import { motion } from 'framer-motion'
import UniverseScene from './components/UniverseScene'
import LessonModal from './components/LessonModal'
import { localLessons } from './data/lessons'
import { attachQuestionBanks } from './data/questionBanks'
import { loadLessons } from './lib/lessonRepository'
import type { DifficultyLevel, GradeLevel, LearningView, Lesson } from './types'

const iconByLesson: Record<string, typeof School> = {
  school: School,
  canteen: Utensils,
  classroom: GraduationCap,
  library: Library,
  home: House,
  market: ShoppingBag,
  mosque: Moon,
  hospital: HeartPulse,
  park: Trees,
  station: Train,
  restaurant: Utensils,
  beach: Waves,
}

function App() {
  const [grade, setGrade] = useState<GradeLevel>('SMP')
  const [view, setView] = useState<LearningView>('universe')
  const [lessons, setLessons] = useState<Lesson[]>(() => attachQuestionBanks(localLessons))
  const [dataSource, setDataSource] = useState<'local' | 'supabase'>('local')
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null)
  const [passedLevels, setPassedLevels] = useState<Record<string, DifficultyLevel[]>>(() => {
    try {
      const saved = window.localStorage.getItem('alu-v02-progress')
      return saved ? JSON.parse(saved) as Record<string, DifficultyLevel[]> : {}
    } catch {
      return {}
    }
  })
  const [xp, setXp] = useState(240)
  const [mobileNavOpen, setMobileNavOpen] = useState(false)

  useEffect(() => {
    let mounted = true
    loadLessons().then((result) => {
      if (!mounted) return
      setLessons(attachQuestionBanks(result.lessons))
      setDataSource(result.source)
    })
    return () => { mounted = false }
  }, [])

  useEffect(() => {
    window.localStorage.setItem('alu-v02-progress', JSON.stringify(passedLevels))
  }, [passedLevels])

  const completedIds = useMemo(
    () => lessons.filter((lesson) => passedLevels[`${grade}:${lesson.id}`]?.includes('advanced')).map((lesson) => lesson.id),
    [grade, lessons, passedLevels],
  )
  const progress = useMemo(() => Math.round((completedIds.length / Math.max(lessons.length, 1)) * 100), [completedIds.length, lessons.length])

  const recordLevelResult = (lessonId: string, resultGrade: GradeLevel, difficulty: DifficultyLevel, score: number) => {
    if (score < 75) return
    const progressKey = `${resultGrade}:${lessonId}`
    if ((passedLevels[progressKey] ?? []).includes(difficulty)) return
    setPassedLevels((current) => {
      const currentLevels = current[progressKey] ?? []
      if (currentLevels.includes(difficulty)) return current
      return { ...current, [progressKey]: [...currentLevels, difficulty] }
    })
    setXp((currentXp) => currentXp + Math.max(10, Math.round(score * 0.25)))
  }

  const openView = (nextView: LearningView) => {
    setView(nextView)
    setMobileNavOpen(false)
  }

  return (
    <div className="app-shell">
      <aside className={`sidebar ${mobileNavOpen ? 'mobile-open' : ''}`}>
        <div className="brand-lockup">
          <div className="brand-mark"><Globe2 size={24} /></div>
          <div><strong>Arabic Universe</strong><span>LEARNING GALAXY</span></div>
          <button className="mobile-close icon-button" onClick={() => setMobileNavOpen(false)} type="button" aria-label="Tutup menu"><X size={18} /></button>
        </div>

        <div className="sidebar-label">LEARNING SPACE</div>
        <nav className="sidebar-nav">
          <button className={view === 'universe' ? 'nav-item active' : 'nav-item'} onClick={() => openView('universe')} type="button">
            <Compass size={18} /><span>Jelajahi Universe</span><ChevronRight size={15} className="nav-chevron" />
          </button>
          <button className={view === 'progress' ? 'nav-item active' : 'nav-item'} onClick={() => openView('progress')} type="button">
            <Trophy size={18} /><span>Progres Belajar</span><ChevronRight size={15} className="nav-chevron" />
          </button>
        </nav>

        <div className="sidebar-label location-label">YOUR DESTINATIONS</div>
        <div className="sidebar-destinations">
          {lessons.slice(0, 5).map((lesson) => {
            const Icon = iconByLesson[lesson.id] ?? Map
            return (
              <button className="destination-link" key={lesson.id} onClick={() => setSelectedLesson(lesson)} type="button">
                <span className="destination-icon" style={{ color: lesson.color }}><Icon size={15} /></span>
                <span>{lesson.name}</span>
                {completedIds.includes(lesson.id) && <CheckCircle2 size={13} className="destination-done" />}
              </button>
            )
          })}
        </div>

        <div className="sidebar-bottom">
          <div className="sidebar-mission">
            <div className="mission-orbit"><Sparkles size={18} /></div>
            <strong>Keep exploring!</strong>
            <p>Satu planet, satu pengalaman Bahasa Arab yang baru.</p>
            <div className="mission-progress"><span style={{ width: `${progress}%` }} /></div>
            <small>{completedIds.length} dari {lessons.length} planet selesai</small>
          </div>
          <div className="sidebar-version"><span className="online-dot" /> Prototype v0.2 · {dataSource === 'supabase' ? 'Supabase' : 'Local demo'}</div>
        </div>
      </aside>

      {mobileNavOpen && <button className="mobile-scrim" onClick={() => setMobileNavOpen(false)} type="button" aria-label="Tutup navigasi" />}

      <main className="main-area">
        <header className="topbar">
          <button className="mobile-menu icon-button" onClick={() => setMobileNavOpen(true)} type="button" aria-label="Buka menu"><Menu size={20} /></button>
          <div className="breadcrumb"><span>Learning Space</span><ChevronRight size={14} /><strong>{view === 'universe' ? 'Universe Explorer' : 'Learning Progress'}</strong></div>
          <div className="topbar-actions">
            <div className="grade-switch" aria-label="Pilih jenjang belajar">
              <button className={grade === 'SMP' ? 'selected' : ''} onClick={() => setGrade('SMP')} type="button">SMP</button>
              <button className={grade === 'SMA' ? 'selected' : ''} onClick={() => setGrade('SMA')} type="button">SMA</button>
            </div>
            <div className="xp-pill"><Zap size={15} fill="currentColor" /><strong>{xp} XP</strong></div>
            <div className="avatar">P</div>
          </div>
        </header>

        <div className="page-content">
          {view === 'universe' ? (
            <>
              <section className="welcome-row">
                <div>
                  <div className="eyebrow"><span className="eyebrow-star">✦</span> PETUALANGAN BELAJAR BAHASA ARAB</div>
                  <h1>Halo, Penjelajah! <span className="wave">✦</span></h1>
                  <p>Jelajahi tempat baru, temukan cerita, dan latih kemampuan Bahasa Arabmu.</p>
                </div>
                <div className="streak-card"><div className="streak-icon"><Flame size={19} fill="currentColor" /></div><div><strong>3 Hari</strong><span>Learning streak</span></div></div>
              </section>

              <section className="universe-section">
                <div className="universe-heading">
                  <div><span className="section-tag">DUNIA ANIMASI</span><h2>Jelajahi Universe</h2><p>Pilih pulau belajar untuk bertemu cerita dan kosakata baru.</p></div>
                  <div className="universe-counter"><Globe2 size={16} /><strong>{lessons.length} Planet</strong><span>·</span><span>{completedIds.length} selesai</span></div>
                </div>
                <div className="universe-stage">
                  <div className="stage-glow stage-glow-one" /><div className="stage-glow stage-glow-two" />
                  <div className="stage-copy"><span>AYO JELAJAHI DUNIA BARU</span><strong>كُلُّ مَكَانٍ قِصَّةٌ جَدِيدَةٌ</strong><small>Setiap tempat punya cerita baru</small></div>
                  <UniverseScene lessons={lessons} completedIds={completedIds} onSelect={setSelectedLesson} />
                  <div className="stage-bottom-note"><span className="legend-dot" /> Pilih pulau untuk mulai belajar</div>
                </div>
              </section>

              <section className="locations-section">
                <div className="section-row-heading"><div><span className="section-tag">PILIH TEMPAT CERITAMU</span><h2>Temukan Lokasi Belajar</h2></div><span className="location-count">{lessons.length} lokasi tersedia</span></div>
                <div className="location-grid">
                  {lessons.map((lesson, index) => {
                    const Icon = iconByLesson[lesson.id] ?? Map
                    const completed = completedIds.includes(lesson.id)
                    return (
                      <motion.button
                        className="location-card"
                        key={lesson.id}
                        onClick={() => setSelectedLesson(lesson)}
                        type="button"
                        whileHover={{ y: -4, scale: 1.015 }}
                        transition={{ duration: 0.18 }}
                      >
                        <div className="location-card-top"><span className="location-card-icon" style={{ color: lesson.color, background: `${lesson.color}18` }}><Icon size={20} /></span><span className="location-number">{String(index + 1).padStart(2, '0')}</span></div>
                        <strong>{lesson.name}</strong><span className="location-arabic" dir="rtl">{lesson.arabicName}</span>
                        <p>{lesson.description}</p>
                        <div className="location-card-bottom"><span>{completed ? <><CheckCircle2 size={13} /> Selesai</> : 'Mulai belajar'}</span><ChevronRight size={16} /></div>
                      </motion.button>
                    )
                  })}
                </div>
              </section>
            </>
          ) : (
            <ProgressView lessons={lessons} completedIds={completedIds} progress={progress} xp={xp} onSelect={setSelectedLesson} />
          )}

          <footer className="page-footer"><span>عَالَمُ اللُّغَةِ الْعَرَبِيَّةِ</span><span>Learn · Listen · Explore</span></footer>
        </div>
      </main>

      {selectedLesson && (
        <LessonModal
          key={`${selectedLesson.id}-${grade}`}
          lesson={selectedLesson}
          grade={grade}
          completed={completedIds.includes(selectedLesson.id)}
          passedLevels={passedLevels[`${grade}:${selectedLesson.id}`] ?? []}
          onClose={() => setSelectedLesson(null)}
          onLevelPassed={recordLevelResult}
        />
      )}
    </div>
  )
}

function ProgressView({ lessons, completedIds, progress, xp, onSelect }: { lessons: Lesson[]; completedIds: string[]; progress: number; xp: number; onSelect: (lesson: Lesson) => void }) {
  const completedLessons = lessons.filter((lesson) => completedIds.includes(lesson.id))
  return (
    <div className="progress-page">
      <div className="eyebrow"><span className="eyebrow-star">✦</span> YOUR LEARNING SUMMARY</div>
      <h1>Progres Belajarmu</h1>
      <p className="progress-lead">Pantau perjalananmu dalam menguasai keterampilan membaca dan menyimak Bahasa Arab.</p>
      <div className="stats-grid">
        <div className="stat-card"><div className="stat-icon purple"><Trophy size={20} /></div><span>Total XP</span><strong>{xp}</strong><small>Poin pengalaman</small></div>
        <div className="stat-card"><div className="stat-icon mint"><CheckCircle2 size={20} /></div><span>Planet selesai</span><strong>{completedIds.length}<small> / {lessons.length}</small></strong><small>Lokasi dipelajari</small></div>
        <div className="stat-card"><div className="stat-icon gold"><Award size={20} /></div><span>Penyelesaian</span><strong>{progress}%</strong><small>Progres keseluruhan</small></div>
      </div>
      <section className="progress-overview">
        <div className="progress-overview-heading"><div><span className="section-tag">LEARNING JOURNEY</span><h2>Perjalanan Pembelajaran</h2></div><span className="progress-percent">{progress}%</span></div>
        <div className="large-progress-track"><span style={{ width: `${progress}%` }} /></div>
        <p>{completedIds.length === 0 ? 'Belum ada planet yang diselesaikan. Pilih satu lokasi dan mulai petualangan pertamamu.' : `Kamu sudah menyelesaikan ${completedIds.length} dari ${lessons.length} planet. Teruskan eksplorasimu!`}</p>
      </section>
      <section className="completed-section"><div className="section-row-heading"><div><span className="section-tag">COMPLETED DESTINATIONS</span><h2>Planet yang Telah Dipelajari</h2></div></div>
        {completedLessons.length ? <div className="completed-list">{completedLessons.map((lesson) => <button className="completed-item" key={lesson.id} onClick={() => onSelect(lesson)} type="button"><span className="completed-mark"><CheckCircle2 size={18} /></span><span><strong>{lesson.name}</strong><small dir="rtl">{lesson.arabicName}</small></span><ChevronRight size={17} /></button>)}</div> : <div className="empty-progress"><div><Star size={25} /></div><strong>Petualanganmu dimulai di sini</strong><p>Selesaikan kuis dari salah satu planet untuk mencatat progres belajar.</p></div>}
      </section>
    </div>
  )
}

export default App
