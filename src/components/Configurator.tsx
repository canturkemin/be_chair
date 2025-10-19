import React, { useState } from 'react'
import { useProductStore } from '../store'
import { db } from '../firebase'
import { collection, addDoc } from 'firebase/firestore'

const groupMap: Record<string, string[]> = {
  Nose: ['Object1030', 'Object998'],
  BodyUp: ['Object1029', 'Object979'],
  BodySide: ['Object1028', 'Object1027', 'Object1026', 'Object1004'],
  LogoInside: ['Object1012', 'Object1012'],
  Sole: ['Object1008', 'Object1006', 'nike swoosh met051'],
  Bottom: ['Object1009', 'Object1002'],
  BodyBack: ['Object1033', 'Object999'],
  FlapBack: ['Object1035', 'Object1007'],
  Inside: ['Object1032', 'Object1000'],
  FlapTop: [
    'Object980', 'Object1026', 'Object1034', 'Object1011',
    'Object997', 'Object1037', 'Object990'
  ],
  Laces: [
    'Object1015', 'Object1016', 'Object1017', 'Object1018',
    'Object1019', 'Object1020', 'Object1021', 'Object1022',
    'Object1023', 'Object1024', 'Object1025', 'Object1010',
    'Object1014', 'Object984', 'Object994', 'Object985',
    'Object986', 'Object987', 'Object988', 'Object989',
    'Object993', 'Object995', 'Object981', 'Object983',
    'Object982', 'Object991'
  ],
  LogoBoxUp: ['Object1013', 'Object996'],
  LogoBack: ['nike swoosh met054', 'nike swoosh met050'],
  LogoOutside: ['Object1031', 'Object1032', 'Object978', 'Object1003'],
  SuedeBack: ['Object1036', 'Object1005'],
}

const groupedCategories: Record<string, string[]> = {
  BodyUp: ['FlapTop', 'LogoBoxUp'],
  BodyBack: ['FlapBack', 'SuedeBack', 'BodyBack'],
  BodyFront: ['Nose', 'BodyUp', 'BodySide'],
  BodyLow: ['Sole', 'Bottom', 'Inside'],
  Logos: ['LogoOutside', 'LogoInside'],
  Laces: ['Laces'],
}

const categoryLabels: Record<string, string> = {
  BodyUp: 'Upper Body',
  BodyBack: 'Back Section',
  BodyFront: 'Front Section',
  BodyLow: 'Lower Body',
  Logos: 'Logos & Branding',
  Laces: 'Laces & Eyelets',
}

const groupLabels: Record<string, string> = {
  BottomInside: 'Bottom Inside',
  FlapTop: 'Top Flap',
  FlapBack: 'Back Flap',
  SuedeBack: 'Suede Panel',
  BodyBack: 'Back Body',
  Nose: 'Toe Cap',
  BodyUp: 'Upper Body',
  BodySide: 'Side Panel',
  Sole: 'Sole',
  Bottom: 'Outsole',
  Inside: 'Inner Body',
  LogoBoxUp: 'Box Logo',
  LogoOutside: 'Outside Logo',
  LogoInside: 'Inside Logo',
  Laces: 'Laces',
  LaceTop: 'Top Lace Section',
}

const availableColors = [
  '#151515', // very dark gray
  '#A9A9A9', // light gray
  '#f0f0f0', // off-white

  '#ff0000', // red
  '#ff6600', // orange
  '#ffff00', // yellow
  '#15f015', // lime green
  '#228B22', // forest green

  '#1515f0', // royal blue
  '#00CED1', // turquoise
  '#800080', // purple
  '#FF69B4', // hot pink

  '#964B00', // brown
  '#D2691E', // chocolate
  '#FFD700', // gold
  '#708090', // slate gray
]

export function Configurator() {
  const groupColors = useProductStore((s) => s.groupColors)
  const setGroupColor = useProductStore((s) => s.setGroupColor)
  const customText = useProductStore((s) => s.customText)
  const setCustomText = useProductStore((s) => s.setCustomText)
  const [openSection, setOpenSection] = useState<string | null>(null)

  const uid = new URLSearchParams(window.location.search).get("uid") || "anon"
  const user_id = new URLSearchParams(window.location.search).get("user_id") || "anon"

  const sendColorChangeToFirebase = async (group: string, color: string) => {
    try {
      await addDoc(collection(db, 'colorClicks'), {
        uid,
        user_id,
        group,
        color,
        timestamp: new Date().toISOString()
      });
    } catch (err) {
      console.error('Error writing to Firestore:', err);
    }
  }

  return (
    <div
      className="overlay"
      style={{
        position: 'absolute',
        top: '60px',
        right: '20px',
        maxWidth: '300px',
        padding: '1rem',
        borderRadius: '8px',
        boxShadow: '0 4px 10px rgba(0, 0, 0, 0.15)',
        zIndex: 10,
      }}
    >
      <h3>Configure Shoe</h3>

      {/* 🧩 Color Sections */}
      {Object.entries(groupedCategories).map(([sectionKey, groups]) => (
        <details
          key={sectionKey}
          open={openSection === sectionKey}
        >
          <summary
            style={{ fontWeight: 'bold', cursor: 'pointer', fontSize: '1.1rem' }}
            onClick={(e) => {
              e.preventDefault()
              setOpenSection((prev) => (prev === sectionKey ? null : sectionKey))
            }}
          >
            {categoryLabels[sectionKey] ?? sectionKey}
          </summary>
          <div style={{ paddingLeft: '1rem' }}>
            {groups.map((group) => (
              <div key={group} style={{ marginBottom: '0.75rem' }}>
                <div style={{ fontWeight: 600, margin: '0.25rem 0' }}>
                  {groupLabels[group] ?? group}
                </div>
                {availableColors.map((color) => (
                  <button
                    key={`${group}-${color}`}
                    className={
                      groupColors[group] === color
                        ? 'buttonColor buttonColorSelected'
                        : 'buttonColor'
                    }
                    style={{
                      backgroundColor: color,
                      width: '24px',
                      height: '24px',
                      margin: '4px',
                      border: groupColors[group] === color ? '2px solid black' : '1px solid #ccc',
                      borderRadius: '50%',
                      cursor: 'pointer',
                    }}
                    onClick={() => {
                      setGroupColor(group, color)
                      console.log(group, color)
                      window.parent.postMessage(
                        {
                          type: 'colorChange',
                          group,
                          color,
                          timestamp: Date.now()
                        },
                        '*'
                      )
                      sendColorChangeToFirebase(group, color)
                    }}
                  />
                ))}
              </div>
            ))}
          </div>
        </details>
      ))}
    </div>
  )
}
