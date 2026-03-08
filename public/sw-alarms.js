let alarms = []

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'UPDATE_ALARMS') {
    alarms = event.data.alarms || []
    console.log('[SW Alarms] Updated alarms:', alarms.length)
  }
})

function checkAlarms() {
  if (alarms.length === 0) return

  const now = new Date()
  const currentHour = String(now.getHours()).padStart(2, '0')
  const currentMinute = String(now.getMinutes()).padStart(2, '0')
  const currentTime = `${currentHour}:${currentMinute}`
  const currentDay = now.getDay()

  for (const alarm of alarms) {
    if (
      alarm.enabled &&
      alarm.time === currentTime &&
      alarm.days.includes(currentDay)
    ) {
      self.registration.showNotification('Moodly', {
        body: alarm.label || '지금 기분은 어떠신가요? 감정을 기록해보세요.',
        icon: '/icons/icon-192.png',
        badge: '/icons/icon-192.png',
        tag: `alarm-${alarm.id}`,
        renotify: false,
        requireInteraction: false
      })
    }
  }
}

setInterval(checkAlarms, 30000)
