# Welcome to Sonic Pi

use_real_time
# use_osc 127.0.0.1, 9998
use_debug 200
use_osc_logging true

live_loop :osc_sample do
  filename = sync "/osc*/play"
  puts "OSC play"
  puts filename.to_s
  sample filename
end
puts "booting"

play 10

