# Tower App Sonic code
# 0.4

use_real_time
use_osc "127.0.0.1",9998 #adjust for output IP to which to send LED on/off signals (TouchOSC)
use_debug true
use_osc_logging true

samples="/srv/TowerBack/storage/app/public"
movies="/srv/Movies"
sirens="/srv/sirens"

sample_pid = play 1
live_loop :osc_sample do
  filename = sync "/osc*/play"
  puts "OSC play"
  if sample_pid
    kill sample_pid
  end
  puts filename.to_s
  osc "/sonicpi/play/" + filename.to_s
  sample_pid = sample filename
end


speech_pid = play 1
live_loop :osc_speak do
  filename = sync "/osc*/speak"
  puts "OSC speak"
  if speech_pid
    kill speech_pid
  end
  puts filename.to_s
  osc "/sonicpi/speak/" + filename.to_s
  with_fx :reverb do
    with_fx :distortion do
      speech_pid = sample filename
    end
  end
  
end

sample_movie = play 1
live_loop :osc_movie do
  nothing = sync "/osc*/movie"
  puts "OSC movie"
  if sample_movie
    kill sample_movie
  end
  movie_file = (sample_paths movies).choose
  osc "/sonicpi/movie" + movie_file.to_s
  
  sample_movie = sample movie_file, amp: 4, attack: 0.75, release: 0.75
end

sirens_pid = play 1
live_loop :osc_sirens do
  puts "OSC Sirens"
  nothing = sync "/osc*/sirens"
  # send to
  if sirens_pid
    kill sirens_pid
  end
  osc "/sonicpi/sirens/"
  sample_file = (sample_paths sirens).choose
  # sample_duration = sample_duration(sample_file)
  # # generate a random starting point
  # start_time = rand(sample_duration - 3)
  # puts "start_time"+start_time
  sirens_pid = sample sample_file,  amp: 2,attack: 0.25, release: 0.75
  # play a 3-second segment starting from the random point
  # sample(sample_file, start: start_time, finish: start_time + 3)
end

random_pid = play 1
live_loop :osc_random do
  puts "OSC Random"
  sample_file = (sample_paths samples).choose
  osc "/sonicpi/random/"+sample_file
  nothing = sync "/osc*/random"
  if random_pid
    kill random_pid
  end
  random_pid = sample sample_file
end

# sample (sample_paths samples).choose
live_loop :osc_tone do
  tone = sync "/osc*/tone"
  puts "OSC Tibe"
  use_octave [0, 1].choose
  play [:c, :e, :g].choose
end


puts "booting"
osc "/sonic/start"

use_bpm 90
use_synth :saw

# Define the notes for the Mac startup sound
notes = [:G4, :E5, :C5, :G4, :C5]

# Define the durations for each note
durations = [0.5, 0.25, 0.25, 0.5, 0.5]

# Play the Mac startup sound
notes.each_with_index do |note, i|
  play note, release: durations[i]
  sleep durations[i] * 0.9 # add a short delay between notes
end

