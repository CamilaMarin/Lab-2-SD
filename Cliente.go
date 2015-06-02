// http://golang.org/pkg/net/http/
package main
import (
"net/http"
"fmt"
"encoding/json"
"io/ioutil"
"log"
"strconv"
"sort"
"math/rand"
)

type Entrada struct { 
    Ordenamiento string `json:"ordenamiento"` 
    Datos []struct { 
        ID string `json:"id"` 
    } `json:"datos"` 
} 
type Salida struct { 
    Datos []struct { 
        ID string `json:"id"` 
    } `json:"datos"` 
} 

func main() {
    http.HandleFunc("/solve", handler)
    err := http.ListenAndServe(":4568", nil)
    if err != nil {
        log.Fatal(err)
    }
}

func handler(w http.ResponseWriter, req *http.Request) {
    w.Header().Set("Content-Type", "text/plain")
    w.WriteHeader(http.StatusOK)
    fmt.Println(req.Proto)
    if req.Method == "POST"{
        body, err := ioutil.ReadAll(req.Body)
         if nil != err {
             fmt.Println("errorination happened reading the body", err)
             return
         }
        entrada := Entrada{}
        json.Unmarshal([]byte(body), &struct {
            *Entrada
        }{&entrada})
        var largo = len(entrada.Datos)
        result := make([]string, largo)
        for i := range entrada.Datos {
            result[i] = entrada.Datos[i].ID
        }
        datos := make([]float64, largo)
        for j := range result{
            i, err := strconv.ParseFloat(result[j], 64)
                if err != nil {
                    // handle error
                    fmt.Println(err)
                }
            datos[j]=i
        }
        fmt.Println(datos)   
        var largo_al = len(entrada.Ordenamiento)
        result_al := make([]string, largo_al)
        for i := range entrada.Ordenamiento {
            result_al[i] = entrada.Ordenamiento
        }
        algoritmo, err := strconv.Atoi(result_al[0])
        if err != nil {
            // handle error
            fmt.Println(err)
        }
        if algoritmo==1 {
            quicksort(sort.Float64Slice(datos))
        }
        if algoritmo==2 {
            mergeSort(datos)
        }
        if algoritmo==3 {
            bubblesort(datos)
        }

        salida := Salida{} 
        salida_str := make([]string, largo)
        for j := range datos{
            salida_str[j] = strconv.FormatFloat(datos[j],'f',20,64)
        }
        fmt.Println(len(salida_str))
        salida.Datos = make([]struct { ID string "json:\"id\"" },largo)
        fmt.Println(len(salida.Datos))
        for k := range salida_str{
            salida.Datos[k].ID = salida_str[k]
        }
        b, err := json.Marshal(salida)
        if err != nil {
            fmt.Println("error:", err)
        }
        w.Write(b)
    }
}

func partition(a sort.Interface, first int, last int, pivotIndex int) int {
    a.Swap(first, pivotIndex) // move it to beginning
    left := first+1
    right := last
    for left <= right {
        for left <= last && a.Less(left, first) {
            left++
        }
        for right >= first && a.Less(first, right) {
            right--
        }
        if left <= right {
            a.Swap(left, right)
            left++
            right--
        }
    }
    a.Swap(first, right) // swap into right place
    return right    
}
 
func quicksortHelper(a sort.Interface, first int, last int) {
    if first >= last {
        return
    }
    pivotIndex := partition(a, first, last, rand.Intn(last - first + 1) + first)
    quicksortHelper(a, first, pivotIndex-1)
    quicksortHelper(a, pivotIndex+1, last)
}
 
func quicksort(a sort.Interface) {
    quicksortHelper(a, 0, a.Len()-1)
}
func mergeSort(a []float64) {
    if len(a) < 2.0 {
        return
    }
    mid := len(a) / 2.0
    mergeSort(a[:mid])
    mergeSort(a[mid:])
    if a[mid-1] <= a[mid] {
        return
    }
    // merge step, with the copy-half optimization
    s := make([]float64, mid)
    copy(s, a[:mid])
    l, r := 0, mid
    for i := 0; ; i++ {
        if s[l] <= a[r] {
            a[i] = s[l]
            l++
            if l == mid {
                break
            }
        } else {
            a[i] = a[r]
            r++
            if r == len(a) {
                copy(a[i+1:], s[l:mid])
                break
            }
        }
    }
    return
}

func bubblesort(a []float64){
    for itemCount := len(a) - 1.0; ; itemCount-- {
        hasChanged := false
        for index := 0; index < itemCount; index++ {
            if a[index] > a[index+1.0] {
                a[index], a[index+1.0] = a[index+1.0], a[index]
                hasChanged = true
            }
        }
        if hasChanged == false {
            break
        }
    }
}