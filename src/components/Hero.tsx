'use client';

import { motion } from 'framer-motion';
import { getSiteContent, getModeContent } from '@/lib/content';
import { useMode } from '@/lib/mode-context';
import Button from './Button';
import ScrollCue from './ScrollCue';
import Headshot from './Headshot';
import Currently from './Currently';

export default function Hero() {
  const content = getSiteContent();
  const { mode } = useMode();
  const modeContent = getModeContent(mode);
  const hero = modeContent.hero;

  return (
    <div className="relative min-h-[60vh] sm:min-h-[70vh] flex items-center">
      {/* Modern background with depth */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute right-1/4 top-0 h-[300px] w-[300px] sm:h-[500px] sm:w-[500px] rounded-full bg-gradient-to-br from-accent/20 via-accent/10 to-transparent blur-3xl" />
        <div className="absolute left-1/4 bottom-0 h-[250px] w-[250px] sm:h-[400px] sm:w-[400px] rounded-full bg-gradient-to-tr from-transparent via-accent/12 to-accent/8 blur-3xl" />
      </div>

      <div className="relative grid w-full gap-8 sm:gap-12 lg:grid-cols-12 lg:items-center lg:gap-8">
        {/* Content Section - Takes 7 columns */}
        <div className="lg:col-span-7 flex flex-col space-y-4 sm:space-y-6 lg:space-y-8 overflow-visible">
          {/* Name - Bold and modern */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <h1 className="text-5xl font-bold tracking-tight text-foreground sm:text-6xl lg:text-7xl xl:text-8xl">
              {hero.name}
            </h1>
          </motion.div>

          {/* Role - Large and clear */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-4"
          >
            <p className="text-xl font-semibold text-foreground/80 sm:text-2xl lg:text-3xl">
              {hero.role}
            </p>
            
            {hero.valueProp && (
              <p className="max-w-2xl text-base leading-relaxed text-foreground/65 sm:text-lg lg:text-xl">
                {hero.valueProp}
              </p>
            )}
          </motion.div>

          {/* Currently section - separate component */}
          {hero.currentlyEnabled !== false && hero.currently && (
            <Currently text={hero.currently} />
          )}

          {/* Badges - Modern pill style */}
          {hero.badges && hero.badges.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex flex-wrap gap-3 pt-2"
            >
              {hero.badges.map((badge, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center rounded-full bg-accent/15 border border-accent/30 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-foreground/70"
                >
                  {badge}
                </span>
              ))}
            </motion.div>
          )}

          {/* CTAs - Modern button group */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-wrap gap-4 pt-4"
          >
            {mode === 'professional' && (
              <Button
                href={content.cta.resumePdfPath}
                variant="primary"
                download
              >
                {content.cta.resumeLabel}
              </Button>
            )}
            <Button
              href={`mailto:${content.person.email}`}
              variant={mode === 'professional' ? 'secondary' : 'primary'}
            >
              {mode === 'professional' ? 'Get in Touch' : 'Say Hi'}
            </Button>
          </motion.div>

          {/* Scroll Cue */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="pt-6"
          >
            <ScrollCue />
          </motion.div>
        </div>

        {/* Headshot Section - Takes 5 columns, overlapping */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, x: 40 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          transition={{ duration: 0.9, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="lg:col-span-5 relative flex justify-center lg:justify-start"
        >
          {hero.headshot ? (
            <div className="relative">
              {/* Modern decorative frame */}
              <div className="absolute -inset-6 -z-10 rounded-[2rem] bg-gradient-to-br from-accent/15 via-accent/5 to-transparent" />
              <div className="absolute -inset-3 -z-10 rounded-3xl border border-accent/10" />
              <Headshot
                src={hero.headshot}
                alt={hero.name}
                className="relative w-64 sm:w-80 lg:w-full lg:max-w-md"
              />
            </div>
          ) : (
            <div className="relative w-64 h-64 sm:w-80 sm:h-80 lg:w-full lg:h-full lg:max-w-md lg:max-h-md overflow-hidden rounded-3xl border-2 border-border bg-gradient-to-br from-muted via-muted-alt to-muted">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="mb-2 text-5xl opacity-20">👤</div>
                  <p className="text-sm font-medium text-foreground/30">Photo</p>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
