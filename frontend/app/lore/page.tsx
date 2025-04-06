"use client"

import { useEffect, useState } from "react"
import { ChevronLeft, ChevronRight, Menu, X, BookOpen, ArrowLeft, Plus, Minus, Bookmark, Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Progress } from "@/components/ui/progress"
import { useParams } from "next/navigation"
import Image from "next/image"
import { useAccount } from "wagmi"
interface Chapter {
  title: string
  content: string
  illustration: string
}

interface Epic {
  title: string
  author: string
  chapters: Chapter[]
}

export default function EpicReader() {
  const { address } = useAccount()
  const [currentChapter, setCurrentChapter] = useState(0)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [fontSize, setFontSize] = useState(16)
  const params = useParams()
  const epicId = params.epicId as string
  const [epic, setEpic] = useState<Epic | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Simulated fetch function - replace with actual API call
  const fetchEpic = async () => {
    setIsLoading(true)
    // Simulate API call
    const response = await fetch(`/api/lore?address=${address}`)
    const data = await response.json()
    setEpic(data.epic)
    // setTimeout(() => {
    //   setEpic({
    //     title: "The Chronicles of Eldoria",
    //     author: "Archmage Thorne",
    //     chapters: [
    //       {
    //         title: "The Awakening",
    //         content:
    //           'In the ancient realm of Eldoria, where magic flows like rivers and mountains touch the heavens, a prophecy long forgotten began to stir. Lyra, daughter of the fallen House Dawnstar, awoke on her eighteenth nameday to find strange runes glowing upon her skin.\n\nThe markings pulsed with an inner light, ancient symbols that had not been seen in the realm for a thousand years. The village elders whispered of the old legends—of the Chosen One who would rise when darkness threatened to consume the land.\n\n"This cannot be," Lyra whispered to herself, tracing the luminescent patterns that spiraled around her forearm. "I am no hero."\n\nBut the runes told a different tale, one written in the language of the Old Gods themselves. As the sun crested over the Mistwood Forest, casting long shadows across her small cottage, Lyra knew her life of simplicity had come to an end.\n\nIn the distance, beyond the safety of the village boundaries, dark clouds gathered over the Forbidden Mountains. The ancient evil that had been sealed away was stirring, testing the strength of its prison. And now, the key to either its continued imprisonment or its freedom rested upon the shoulders of a young woman who had never ventured beyond the village borders.',
    //         illustration: "/placeholder.svg?height=800&width=600",
    //       },
    //       {
    //         title: "The Call to Arms",
    //         content:
    //           'The Council of Elders gathered in the ancient Grove of Whispers, their faces grave as they discussed the appearance of the sacred runes. Lyra stood before them, her heart pounding like a war drum in her chest.\n\n"The signs are unmistakable," declared Elder Morath, his weathered hand gesturing to the markings on Lyra\'s skin. "The Prophecy of the Seven Stars speaks of one who bears the runes of the ancients. One who will either save our realm or doom it to eternal darkness."\n\nLyra\'s voice trembled as she spoke. "But I know nothing of magic or warfare. How am I to stand against this darkness?"\n\nFrom the shadows stepped a figure clad in armor that seemed to absorb the very light around it. The legendary knight, Sir Gareth of the Obsidian Order, his face bearing scars from battles long past.\n\n"You will not stand alone," he said, his voice deep and resonant. "The prophecy speaks of companions who will aid the Chosen One. I have sworn an oath to be the first of these."\n\nElder Morath nodded solemnly. "The journey ahead is perilous. You must seek out the remaining five companions mentioned in the prophecy. Together, you must recover the Artifacts of Power before the Dark Lord\'s forces claim them."\n\nLyra looked down at the runes, which now glowed with an intensity that matched the determination slowly building within her. She was no warrior, no mage, but perhaps destiny had chosen her for reasons beyond her understanding.\n\n"When do we depart?" she asked, surprising herself with the steadiness of her voice.\n\nSir Gareth\'s lips curved into a grim smile. "At dawn. The enemy already moves. We have no time to waste."',
    //         illustration: "/placeholder.svg?height=800&width=600",
    //       },
    //       {
    //         title: "The First Trial",
    //         content:
    //           'The Mistwood Forest loomed before them, ancient trees reaching toward the sky like gnarled fingers. Legends spoke of creatures that dwelled within—beings neither fully of this world nor entirely of another.\n\n"The forest tests all who enter," Sir Gareth explained as they approached the treeline. "It will find your deepest fears and bring them to life before your eyes."\n\nLyra swallowed hard, her hand instinctively moving to the dagger at her belt—a gift from Elder Morath, forged in dragonfire and blessed by the temple priestesses. "And how do we overcome these trials?"\n\n"By facing them," came the simple reply. "Fear conquered is power gained."\n\nThey had barely taken ten steps into the forest when the mist began to thicken around them, separating Lyra from her companion. Panic rose in her throat as she called out, but her voice seemed swallowed by the unnatural fog.\n\nThen, from the mist, figures emerged—shadowy forms that gradually took shape. Her parents, whom she had lost to the plague years ago, their faces twisted in disappointment.\n\n"You failed us," they whispered in unison, their voices like dry leaves rustling in the wind. "You will fail everyone."\n\nLyra\'s heart hammered against her ribs, but she remembered Sir Gareth\'s words. This was the forest\'s test. These were not her parents, but manifestations of her own self-doubt.\n\n"You are not real," she declared, raising her dagger. The runes on her arm blazed with sudden light, illuminating the forest around her. "And I will not be defined by my fears."\n\nThe apparitions wavered, their forms becoming less substantial. Lyra stepped forward, through them, and they dissipated like smoke. As she continued forward, the mist thinned, revealing Sir Gareth waiting in a small clearing ahead.\n\n"You passed your first trial," he said, a hint of pride in his voice. "The forest has judged you worthy to proceed."\n\nLyra nodded, a new confidence flowing through her veins alongside the ancient magic that had chosen her. The path ahead would be fraught with danger, but perhaps—just perhaps—she was stronger than she had ever allowed herself to believe.',
    //         illustration: "/placeholder.svg?height=800&width=600",
    //       },
    //       {
    //         title: "The Hidden City",
    //         content:
    //           'After seven days of travel through the treacherous Mistwood, Lyra and Sir Gareth emerged onto a high ridge overlooking a vast valley. Below, hidden partially by enchanted mists, lay the legendary city of Aetheria—home to the Keepers of Knowledge and the rumored location of the first Artifact of Power.\n\n"Few outsiders are permitted to enter the Silver Gates," Sir Gareth explained, his eyes fixed on the gleaming spires that pierced the mist. "The Keepers have guarded their secrets since the First Age."\n\nLyra studied the city with wonder. Structures of impossible architecture rose and fell in graceful arcs, bridges of light connected towers that seemed built from solidified moonlight, and at the center, a massive crystal dome pulsed with magical energy visible even from their distant vantage point.\n\n"How will we gain entry?" she asked.\n\nSir Gareth turned to her, his expression grave. "We must speak the truth of our quest. The Keepers can sense deception as easily as you and I can sense rain. But be warned—they may test your resolve in ways far more challenging than the forest did."\n\nAs they descended toward the city, Lyra felt the runes on her arm grow warm. The closer they came to the Silver Gates, the more intensely they glowed, as if responding to the ancient magic that permeated Aetheria.\n\nAt the gates stood two figures in flowing silver robes, their faces obscured by hoods that seemed to contain swirling galaxies rather than shadow.\n\n"Halt," commanded one, its voice neither male nor female but something altogether different. "State your purpose, bearers of the old magic."\n\nLyra stepped forward, guided by an instinct she didn\'t fully understand. She extended her arm, revealing the glowing runes. "I am Lyra of House Dawnstar. I seek the Artifact of Clarity to prevent the return of the Dark Lord."\n\nThe gatekeepers remained motionless for a long moment. Then, simultaneously, they stepped aside, the massive silver gates swinging open without a sound.\n\n"The Prophecy walks among us," they intoned. "Enter, Chosen One, but know this—the Artifact chooses its bearer. It cannot be taken, only earned."\n\nAs Lyra and Sir Gareth passed through the gates, the knight leaned close to whisper: "Be on your guard. Not all in Aetheria will welcome the fulfillment of the prophecy. There are those who thrive in chaos and would see the Dark Lord return."\n\nLyra nodded, her hand once again finding the hilt of her dagger. The city of knowledge spread before them, beautiful and dangerous in equal measure—much like the destiny she had begun to embrace.',
    //         illustration: "/placeholder.svg?height=800&width=600",
    //       },
    //       {
    //         title: "The Artifact of Clarity",
    //         content:
    //           'The Hall of Infinite Wisdom stretched before Lyra and Sir Gareth, its ceiling a perfect recreation of the night sky, constellations shifting and moving in patterns that told stories of ages past. Scholars in robes of varying hues moved between towering bookshelves, some floating gently above the ground to reach the highest tomes.\n\n"The Artifact of Clarity is said to be housed in the Chamber of Reflection," Sir Gareth murmured, his eyes scanning the vast hall. "But its location is known only to the High Keeper."\n\nAs if summoned by his words, an elderly woman approached them, her silver hair forming an intricate crown atop her head. Despite her apparent age, she moved with the grace of youth, and her eyes—a startling violet—held wisdom that made Lyra feel like a child.\n\n"I am Keeper Isolde," she announced, her gaze fixed on the runes adorning Lyra\'s skin. "The stars have spoken of your coming for centuries, Daughter of Dawnstar."\n\nLyra bowed her head respectfully. "Then you know why we seek the Artifact?"\n\n"I know many things," Isolde replied cryptically. "Including that the Artifact you seek cannot simply be handed to you. It must be earned through understanding."\n\nThe High Keeper led them through a series of increasingly narrow corridors until they reached a circular chamber. At its center stood a pedestal upon which rested a simple silver mirror, its frame inscribed with runes similar to those on Lyra\'s arm.\n\n"The Mirror of Truth," Isolde explained. "The first of the Seven Artifacts. It shows not your reflection, but the truth of your soul and the clarity of your purpose."\n\nLyra approached cautiously. "What must I do?"\n\n"Gaze into the mirror and speak your true intention. If your heart is pure and your resolve unwavering, the mirror will accept you as its bearer."\n\nTaking a deep breath, Lyra stood before the ancient artifact. As she looked into its surface, she saw not her own reflection but a swirling vortex of images—her past, possible futures, the faces of those she had yet to meet, battles not yet fought.\n\n"I seek the Mirror of Truth," she declared, her voice stronger than she felt, "not for power or glory, but to protect those who cannot protect themselves. To stand against the darkness that threatens to consume all light in Eldoria."\n\nFor a moment, nothing happened. Then, the images in the mirror coalesced into a single, blinding light. When it faded, the mirror had transformed into a small amulet, which floated gently into Lyra\'s outstretched hand.\n\n"The mirror has judged you worthy," Isolde said, a smile touching her lips. "But be warned—each artifact comes with its own burden. The Mirror of Truth will show you things you may not wish to see, truths you may not be prepared to face."\n\nLyra closed her fingers around the amulet, feeling its power resonate with the magic in her runes. "Thank you, High Keeper."\n\n"Do not thank me yet, child," Isolde replied, her expression growing grave. "Your quest has only just begun, and already the Dark Lord\'s servants move against you. The path to the second artifact—the Sword of Justice—lies through the Scorched Plains, where the line between ally and enemy blurs like mirages in the heat."\n\nSir Gareth stepped forward. "We should depart at first light. The longer we remain in one place, the easier we are to track."\n\nIsolde nodded in agreement. "Rest tonight within our walls. You will find no safer haven in all of Eldoria. But remember, Chosen One—the greatest dangers often lie not in the enemies we can see, but in the doubts that plague our own hearts."',
    //         illustration: "/placeholder.svg?height=800&width=600",
    //       },
    //     ],
    //   })
    //   setIsLoading(false)
    // }, 1000)
    setTimeout(() => {
      setIsLoading(false)
    }, 1000)
  }

  useEffect(() => {
    fetchEpic()
  }, [address])

  const nextChapter = () => {
    if (currentChapter < (epic?.chapters.length ?? 0) - 1) {
      setCurrentChapter(currentChapter + 1)
      window.scrollTo(0, 0)
    }
  }

  const previousChapter = () => {
    if (currentChapter > 0) {
      setCurrentChapter(currentChapter - 1)
      window.scrollTo(0, 0)
    }
  }

  const increaseFontSize = () => {
    setFontSize((prev) => Math.min(prev + 2, 24))
  }

  const decreaseFontSize = () => {
    setFontSize((prev) => Math.max(prev - 2, 12))
  }

  const progress = ((currentChapter + 1) / (epic?.chapters.length ?? 0)) * 100

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-lg">Loading epic tale...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Top Navigation Bar */}
      <div className="fixed top-0 left-0 right-0 bg-black/80 backdrop-blur-sm border-b border-zinc-800 z-10">
        <div className="flex items-center justify-between p-2 sm:p-4">
          <div className="flex items-center gap-2 sm:gap-4">
            <Button variant="ghost" size="icon" onClick={() => window.history.back()} className="text-white hover:text-white hover:bg-white/10">
              <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="text-white hover:text-white hover:bg-white/10">
              {isSidebarOpen ? <X className="w-4 h-4 sm:w-5 sm:h-5" /> : <Menu className="w-4 h-4 sm:w-5 sm:h-5" />}
            </Button>
          </div>
          <div className="hidden md:block text-center font-serif">
            <h1 className="text-lg font-bold text-white">{epic?.title}</h1>
          </div>
          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-2 text-sm me-4 text-white">
              <BookOpen className="w-4 h-4" />
              <span className="font-medium">
                Chapter {currentChapter + 1} of {epic?.chapters.length ?? 0}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" onClick={decreaseFontSize} className="h-8 w-8 text-white hover:text-white hover:bg-white/10">
                <Minus className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={increaseFontSize} className="h-8 w-8 text-white hover:text-white hover:bg-white/10">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
        <Progress value={progress} className="h-1" />
      </div>

      {/* Main Content - Two Column Layout */}
      <main className="fixed top-[73px] bottom-0 left-0 right-0">
        <div className="grid md:grid-cols-2 h-full">
          {/* Left Column - Illustration */}
          <div className="hidden md:flex items-center justify-center p-4 bg-zinc-900/30">
            <div className="relative w-full max-w-lg aspect-[3/4] rounded-lg overflow-hidden shadow-xl border">
              <Image
                src={epic?.chapters[currentChapter].illustration || "/placeholder.svg?height=800&width=600"}
                alt={`Illustration for ${epic?.chapters[currentChapter].title}`}
                fill
                className="object-cover"
              />
            </div>
          </div>

          {/* Right Column - Story Text */}
          <div className="px-4 md:px-8 py-6 overflow-y-auto bg-black">
            {/* Mobile Illustration (shown only on small screens) */}
            <div className="md:hidden mb-6 flex justify-center">
              <div className="relative w-full max-w-sm aspect-[3/4] rounded-lg overflow-hidden shadow-lg border">
                <Image
                  src={epic?.chapters[currentChapter].illustration || "/placeholder.svg?height=800&width=600"}
                  alt={`Illustration for ${epic?.chapters[currentChapter].title}`}
                  fill
                  className="object-cover"
                />
              </div>
            </div>

            <div className="max-w-prose mx-auto">
              <h1 className="text-xl sm:text-2xl font-bold text-center font-serif md:hidden text-white">{epic?.title}</h1>
              <h2 className="text-lg sm:text-xl font-semibold text-center mt-2 font-serif text-white">
                Chapter {currentChapter + 1}: {epic?.chapters[currentChapter].title}
              </h2>
              <div className="flex justify-center items-center gap-4 mt-2 text-sm text-zinc-400">
                <button className="flex items-center gap-1 hover:text-white">
                  <Bookmark className="w-4 h-4" />
                  <span>Bookmark</span>
                </button>
                <button className="flex items-center gap-1 hover:text-white">
                  <Share2 className="w-4 h-4" />
                  <span>Share</span>
                </button>
              </div>
              <article className="prose-invert prose-lg z-30 mt-6 max-w-none">
                <div
                  className="whitespace-pre-wrap font-serif text-justify text-white"
                  style={{ fontSize: `${fontSize}px`, lineHeight: "1.8" }}
                >
                  {epic?.chapters[currentChapter].content + '\n\n\n\n'}
                </div>
              </article>
            </div>
          </div>
        </div>
      </main>

      {/* Chapter Sidebar */}
      <div
        className={`fixed top-[73px] z-50 left-0 bottom-0 w-64 sm:w-72 bg-black border-r border-zinc-800 transform transition-transform duration-200 ease-in-out ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } z-20`}
      >
        <ScrollArea className="h-full">
          <div className="p-4 flex flex-col">
            <div className="flex flex-col gap-1">
              <h2 className="font-serif font-bold text-lg text-white break-words">{epic?.title}</h2>
              <p className="text-sm text-zinc-400 break-words">by {epic?.author}</p>
            </div>
            <div className="flex flex-col gap-1 mt-4">
              {epic?.chapters.map((chapter, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setCurrentChapter(index)
                    setIsSidebarOpen(false)
                    window.scrollTo(0, 0)
                  }}
                  className={`w-full text-left px-4 py-2 rounded-lg text-sm text-white ${
                    currentChapter === index ? "bg-zinc-800 text-white font-medium" : "hover:bg-zinc-800"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="font-medium min-w-[1.5rem]">{index + 1}.</span>
                    <span className="break-words flex-1">{chapter.title}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </ScrollArea>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 border-t border-zinc-800 p-2 z-20 sm:p-4 bg-black/80 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto flex justify-between gap-4">
          <Button
            variant="outline"
            onClick={previousChapter}
            disabled={currentChapter === 0}
            className="flex-1 sm:flex-none border-zinc-700 text-black hover:bg-zinc-500 hover:text-black"
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">Previous Chapter</span>
            <span className="sm:hidden">Previous</span>
          </Button>
          <Button
            variant="default"
            onClick={nextChapter}
            disabled={currentChapter === (epic?.chapters.length ?? 0) - 1}
            className="flex-1 sm:flex-none bg-zinc-800 text-white hover:bg-zinc-500"
          >
            <span className="hidden sm:inline">Next Chapter</span>
            <span className="sm:hidden">Next</span>
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  )
}

