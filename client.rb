require 'rubygems'
require 'sinatra'
require 'json'

require "net/http"
require "uri"

post '/solve' do 

	request.body.rewind
  	@datos = JSON.parse request.body.read
  	lineas = @datos["datos"]
  	ordenamiento = @datos["ordenamiento"].to_i
  	array = Array.new
  	lineas.each do |line|
  		array.push(line["id"].to_f)
  	end

  	puts ""
	puts "Original"
  	puts array

  	if ordenamiento == 1
  		puts ""
  		puts "Quicksort"
  		quicksort array
  		puts array
  	elsif ordenamiento == 2
  		puts ""
  		puts "Mergesort"
  		array2 = mergesort array
  		puts array2
  	else
  		puts ""
  		puts "Bubblesort"
  		array2 = bubblesort array
  		puts array2
  	end
  		
end

def quicksort(array, from=0, to=nil)
    if to == nil
        to = array.count - 1
    end

    if from >= to
        return
    end
    
    pivot = array[from]
 
    min = from
    max = to
 
    free = min
 
    while min < max
        if free == min 
            if array[max] <= pivot 
                array[free] = array[max]
                min += 1
                free = max
            else
                max -= 1
            end
        elsif free == max 
            if array[min] >= pivot 
                array[free] = array[min]
                max -= 1
                free = min
            else
                min += 1
            end
        else
            raise "Inconsistent state"
        end
    end
 
    array[free] = pivot
 
    quicksort array, from, free - 1
    quicksort array, free + 1, to
end

def mergesort(array)
    if array.count <= 1
        return array
    end

    mid = array.count / 2
    part_a = mergesort array.slice(0, mid)
    part_b = mergesort array.slice(mid, array.count - mid)
 
    array = []
    offset_a = 0
    offset_b = 0
    while offset_a < part_a.count && offset_b < part_b.count
        a = part_a[offset_a]
        b = part_b[offset_b]
 
        if a <= b
            array << a
            offset_a += 1
        else
            array << b
            offset_b += 1
        end
    end
 
    while offset_a < part_a.count
        array << part_a[offset_a]
        offset_a += 1
    end
 
    while offset_b < part_b.count
        array << part_b[offset_b]
        offset_b += 1
    end
 
    return array
end

def bubblesort(list)
  return list if list.size <= 1 

  swapped = true
  while swapped
    swapped = false 
    0.upto(list.size-2) do |i|
      if list[i] > list[i+1]
        list[i], list[i+1] = list[i+1], list[i] 
        swapped = true 
      end
    end
  end

  list
end
