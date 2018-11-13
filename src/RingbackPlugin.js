import { FlexPlugin } from 'flex-plugin';

export default class WhispersPlugin extends FlexPlugin {
  name = 'RingbackPlugin';

  init(flex, manager) {

    let audio = new Audio()

    manager.workerClient.on('reservationCreated', reservation => {
      const isVoiceQueue = reservation.task.taskChannelUniqueName === 'voice'
      const hasRingback = reservation.task.attributes.ringback !== undefined;
      if (isVoiceQueue && hasRingback) {
        playAudio(reservation)
      }
    });

    const playAudio = (reservation) => {
      const audioFile = reservation.task.attributes.ringback;
      const isInboundTask = reservation.task.attributes.direction === 'inbound'
      if (!isInboundTask) return

      audio.src = audioFile

      audio.play()

      reservation.on('accepted', reservation => audio.pause())
      reservation.on('canceled', reservation => audio.pause())
      reservation.on('rejected', reservation => audio.pause())
      reservation.on('rescinded', reservation => audio.pause())
      reservation.on('timeout', reservation => audio.pause())
    }
  }
}
