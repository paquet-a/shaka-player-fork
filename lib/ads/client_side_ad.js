/**
 * @license
 * Copyright 2016 Google Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */


goog.provide('shaka.ads.ClientSideAd');

/**
 * @implements {shaka.extern.IAd}
 * @export
 */
shaka.ads.ClientSideAd = class {
  /**
   * @param {!google.ima.Ad} imaAd
   * @param {!google.ima.AdsManager} imaAdManager
   */
  constructor(imaAd, imaAdManager) {
    /** @private {google.ima.Ad} */
    this.ad_ = imaAd;

    /** @private {google.ima.AdsManager} */
    this.manager_ = imaAdManager;

    /** @private {boolean} */
    this.isPaused_ = false;

    /** @private {number} */
    this.volume_ = this.manager_.getVolume();

    /** @private {shaka.util.EventManager} */
    this.eventManager_ = new shaka.util.EventManager();

    this.eventManager_.listen(this.manager_,
        google.ima.AdEvent.Type.PAUSED, () => {
          this.isPaused_ = true;
        });

    this.eventManager_.listen(this.manager_,
        google.ima.AdEvent.Type.RESUMED, () => {
          this.isPaused_ = false;
        });
  }

  /**
   * @override
   * @export
   */
  getDuration() {
    return this.ad_.getDuration();
  }

  /**
   * @override
   * @export
   */
  getRemainingTime() {
    return this.manager_.getRemainingTime();
  }

  /**
   * @override
   * @export
   */
  isPaused() {
    return this.isPaused_;
  }

  /**
   * @param {boolean} paused
   */
  setPaused(paused) {
    this.isPaused_ = paused;
  }

  /**
   * @override
   * @export
   */
  pause() {
    return this.manager_.pause();
  }

  /**
   * @override
   * @export
   */
  play() {
    return this.manager_.resume();
  }


  /**
   * @override
   * @export
   */
  getVolume() {
    return this.manager_.getVolume();
  }

  /**
   * @override
   * @export
   */
  setVolume(volume) {
    return this.manager_.setVolume(volume);
  }

  /**
   * @override
   * @export
   */
  isMuted() {
    return this.manager_.getVolume() == 0;
  }


  /**
   * @override
   * @export
   */
  resize(width, height) {
    const viewMode = document.fullscreenElement ?
        google.ima.ViewMode.FULLSCREEN : google.ima.ViewMode.NORMAL;
    this.manager_.resize(width, height, viewMode);
  }

  /**
   * @override
   * @export
   */
  setMuted(muted) {
    // Emulate the "mute" functionality, where current, pre-mute
    // volume is saved and can be restored on unmute.
    if (muted) {
      this.volume_ = this.getVolume();
      this.setVolume(0);
    } else {
      this.setVolume(this.volume_);
    }
  }

  /**
   * @override
   * @export
   */
  release() {
    this.ad_ = null;
    this.manager_ = null;
  }
};
