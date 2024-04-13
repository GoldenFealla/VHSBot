import playSlash from './slash/play.js'
import currentSlash from './slash/current.js'
import queueSlash from './slash/queue.js'
import skipSlash from './slash/skip.js'
import skiptoSlash from './slash/skipto.js'
import leaveSlash from './slash/leave.js'
import pauseSlash from './slash/pause.js'
import resumeSlash from './slash/resume.js'
import loopSlash from './slash/loop.js'
import shuffleSlash from './slash/shuffle.js'
import seekSlash from './slash/seek.js'

/**
 * @type {VHSModule}
 */
export const MusicModule = {
    slashes: [
        playSlash,
        currentSlash,
        queueSlash,
        skipSlash,
        skiptoSlash,
        leaveSlash,
        pauseSlash,
        resumeSlash,
        loopSlash,
        shuffleSlash,
        seekSlash
    ]
};