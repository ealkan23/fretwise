// Browser bundle: Basic Pitch + the tfjs pieces it needs (WebGL backend, CPU fallback). Built by tools/build-vendor.js.
import * as tf from '@tensorflow/tfjs';
import {BasicPitch,outputToNotesPoly,noteFramesToTime} from '@spotify/basic-pitch';
window.FWBP={tf,BasicPitch,outputToNotesPoly,noteFramesToTime};
