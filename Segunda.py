from flask import Flask
from flask import request
from decimal import *
import json
app = Flask(__name__)

@app.route('/solve', methods=[ 'POST'])
def hello():
    entrada=request.data
    datos=json.loads(entrada)
    arreglo=[]
    ordenamiento=datos["ordenamiento"]
    for i in range(len(datos["datos"])):
        temp=Decimal(datos["datos"][i]["id"])
        arreglo.append(temp)
    if ordenamiento == '3':
        print "Bubble !"
        ordenado = arreglo
        bubble_sort(ordenado)
    elif ordenamiento == '1':
        print "Quick !"
        ordenado = quick_sort(arreglo)
    elif ordenamiento == '2':
        print "Merge !"
        ordenado = merge_sort(arreglo)
    else:
        print "mala entrada"
    archivo={"datos":[]}
    for i in range(len(ordenado)):
        archivo["datos"].append({'id':str(ordenado[i])})
    return json.dumps(archivo)

def bubble_sort(seq):
    changed = True
    while changed:
        changed = False
        for i in xrange(len(seq) - 1):
            if seq[i] > seq[i+1]:
                seq[i], seq[i+1] = seq[i+1], seq[i]
                changed = True
    return None
def quick_sort(arr):
    less = []
    pivotList = []
    more = []
    if len(arr) <= 1:
        return arr
    else:
        pivot = arr[0]
        for i in arr:
            if i < pivot:
                less.append(i)
            elif i > pivot:
                more.append(i)
            else:
                pivotList.append(i)
        less = quick_sort(less)
        more = quick_sort(more)
        return less + pivotList + more

def merge_sort(m):
    if len(m) <= 1:
        return m
 
    middle = len(m) // 2
    left = m[:middle]
    right = m[middle:]
 
    left = merge_sort(left)
    right = merge_sort(right)
    return list(merge(left, right))

def merge(left, right):
    result = []
    left_idx, right_idx = 0, 0
    while left_idx < len(left) and right_idx < len(right):
        # change the direction of this comparison to change the direction of the sort
        if left[left_idx] <= right[right_idx]:
            result.append(left[left_idx])
            left_idx += 1
        else:
            result.append(right[right_idx])
            right_idx += 1
 
    if left:
        result.extend(left[left_idx:])
    if right:
        result.extend(right[right_idx:])
    return result
if __name__ == "__main__":
    app.run(port= 8082)
