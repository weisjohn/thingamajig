export default {
  widget1: { name: 'rocket', parts: ['spoke', 'wheel'] },
  widget2: { name: 'spring', parts: ['hub', 'wheel'] },
  gadget1: { name: 'tailx', widgets: ['rocket'], functions: ['sig'] },
  gadget2: { name: 'devel', widgets: ['spring'], functions: ['hash'] },
  function1: { name: 'sig', gadget: 'tailx' },
  sig: '{widgets{0rocketfunctions{0signametailx',
  function2: { name: 'hash', gadget: 'devel' },
  hash: '869e8f57a0b2dc567ece0c93caeae6580a86abd6e7051c22f40498e6a2923056',
};
