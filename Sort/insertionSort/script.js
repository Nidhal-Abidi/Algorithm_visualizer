hljs.highlightAll()

const btn1 = document.querySelector(".btn1")
//const btn2 = document.querySelector(".btn2")
const form = document.querySelector("form")
const animationRslt = document.querySelector(".animation-result")
const arrInput = document.querySelector("#arr-input")
//const key = document.querySelector("#search-key")

const errors = document.querySelector(".error")

const canvas = document.querySelector("#canvas")
const ctx = canvas.getContext("2d")

/* During conversion to react get rid of all unnecessary global variables  */
const radius = 40 // To draw the circle
const edge = 80 //To draw square

// We start by drawing the squares (ie coordinates below represent upper left corner of square)
let x_axis_pos = canvas.width / 10 - radius
let y_axis_pos = canvas.height / 9 - radius
const dx = 20
const dy = 30

//Initial values for x_axis_pos (back and front)
let x_axis_pos_back = canvas.width / 10 - edge / 2
let y_axis_pos_back = canvas.height / 9 - edge / 2

let x_axis_pos_front = canvas.width / 10 - edge / 2 + (edge + dx)
let y_axis_pos_front = canvas.height / 9 - edge / 2

/** Input validation */
form.addEventListener("submit", (e) => {
  e.preventDefault()
  let errorMsgs = []
  let arrInputValues = [] //So that I can pass it to method "bubbleSort"

  if (arrInput.value.length === 0) {
    errorMsgs.push("Array shouldn't be empty")
  } else {
    //Chosen delimitor is "," + all values should be numbers
    arrInputValues = arrInput.value.split(",")
    arrInputValues = arrInputValues.map((elt) => {
      return parseInt(elt)
    })
    const isNumeric = arrInputValues.every((elt) => {
      return typeof elt === "number" && !isNaN(elt)
    })
    if (!isNumeric) {
      errorMsgs.push("Array shouldn't contain non number elements")
    }
  }

  if (errorMsgs.length > 0) {
    console.log(errorMsgs)
    errors.innerText = errorMsgs
  } else {
    errors.innerText = ""
    //We should disable "Begin Animation" btn + enable "Pause/Resume" btn
    //btn2.classList.remove("not-working")

    btn1.setAttribute("disabled", "")
    //console.log(btn1)
    btn1.classList.add("not-working")

    //1)Draw the initial array on the screen
    drawArray()
    //2)Initiate animation
    insertionSort(
      arrInputValues,
      arrInputValues.length,
      1,
      0,
      canvas.width / 10 - edge / 2 + edge + dx,
      canvas.height / 9 - edge / 2,
      canvas.width / 10 - edge / 2,
      canvas.height / 9 - edge / 2
    )
  }
})

/* Animation JS */

const drawArray = () => {
  clearPreviousData()
  /*Note : "x_axis_pos" is different depending on the shape that's being drawn 
        //Circle: it represents the center
        //Square: represents the upper left corner

        + to be on top of each other: 
        1) radius = edge / 2
        2) X_circle = X_square + edge/2
           Y_circle = Y_square + edge/2
    */
  console.log("Drawing Input Array ")
  const radius = 40 // To draw the circle
  const edge = 80 //To draw square
  // We start by drawing the squares (ie coordinates below represent upper left corner of square)
  let x_axis_pos = canvas.width / 10 - radius
  let y_axis_pos = canvas.height / 9 - radius

  const dx = 20
  const dy = 30

  let i = 0

  let arrInputValues = arrInput.value.split(",")
  arrInputValues = arrInputValues.map((elt) => {
    return parseInt(elt)
  })

  arrInputValues.forEach((nbr) => {
    if (x_axis_pos + edge + dx < canvas.width) {
      ctx.textAlign = "center"
      ctx.textBaseline = "middle"
      ctx.font = "20px Helvetica"
      ctx.fillStyle = "#38f"
      ctx.lineWidth = 2
      //Code for drawing
      ctx.beginPath()
      ctx.rect(x_axis_pos, y_axis_pos, edge, edge)
      ctx.stroke()
      //Write the text inside the shape
      ctx.fillText(nbr, x_axis_pos + edge / 2, y_axis_pos + edge / 2)

      x_axis_pos += edge + dx
    } else {
      //Return to a new line
      y_axis_pos += edge + dy
      x_axis_pos = canvas.width / 10 - radius

      ctx.beginPath()
      ctx.rect(x_axis_pos, y_axis_pos, edge, edge)
      ctx.stroke()
      //Write the text inside the shape
      ctx.fillText(nbr, x_axis_pos + edge / 2, y_axis_pos + edge / 2)
      x_axis_pos += edge + dx

      i += 1
      //console.log("line= " + i)
    }
  })

  console.log("Let's start the Animation !!")
}

const rectToCircleAnimation = (ctx, x_axis_pos, y_axis_pos, edge, nbr) => {
  ctx.clearRect(x_axis_pos - 0.5, y_axis_pos - 0.5, edge + 2, edge + 2)
  ctx.lineWidth = 4

  ctx.fillText(nbr, x_axis_pos + edge / 2, y_axis_pos + edge / 2)
  ctx.beginPath()
  ctx.arc(
    x_axis_pos + edge / 2,
    y_axis_pos + edge / 2,
    edge / 2,
    0,
    2 * Math.PI
  )
  ctx.stroke()
}

const circleToRectAnimation = (ctx, x_axis_pos, y_axis_pos, edge, nbr) => {
  ctx.clearRect(x_axis_pos - 3, y_axis_pos - 3, edge + 6, edge + 6)
  ctx.fillText(nbr, x_axis_pos + edge / 2, y_axis_pos + edge / 2)
  //Attention to below "lineWidth"
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.rect(x_axis_pos, y_axis_pos, edge, edge)
  ctx.stroke()
}

const clearPreviousData = () => {
  console.log("Clearning Canvas")
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  animationRslt.innerHTML = ""
}

const success = () => {
  console.log("Congrats The Array is Sorted !!")
  animationRslt.innerText = "Congrats The Array is Sorted :)"
  animationRslt.style.backgroundColor = "green"
  animationRslt.style.fontSize = "30px"
}

/** 9 is the nbr of squares that we can fit in 1 line (taking into account this config) */
const swap = (arr, step, min_indx) => {
  const temp = arr[step]
  //I used green to mark that the current min is included inside the sorted part of the array
  ctx.strokeStyle = "green"
  rectToCircleAnimation(
    ctx,
    canvas.width / 10 - edge / 2 + (min_indx % 9) * (edge + dx),
    canvas.height / 9 - edge / 2 + Math.floor(min_indx / 9) * (edge + dy),
    edge,
    temp
  )
  circleToRectAnimation(
    ctx,
    canvas.width / 10 - edge / 2 + (min_indx % 9) * (edge + dx),
    canvas.height / 9 - edge / 2 + Math.floor(min_indx / 9) * (edge + dy),
    edge,
    temp
  )
  rectToCircleAnimation(
    ctx,
    canvas.width / 10 - edge / 2 + (step % 9) * (edge + dx),
    canvas.height / 9 - edge / 2 + Math.floor(step / 9) * (edge + dy),
    edge,
    arr[min_indx]
  )
  circleToRectAnimation(
    ctx,
    canvas.width / 10 - edge / 2 + (step % 9) * (edge + dx),
    canvas.height / 9 - edge / 2 + Math.floor(step / 9) * (edge + dy),
    edge,
    arr[min_indx]
  )

  //Return the stroke to the default color
  ctx.strokeStyle = "black"

  arr[step] = arr[min_indx]
  arr[min_indx] = temp
  return arr
}

const insertionSort = (
  arr,
  n,
  i,
  j,
  key_x,
  key_y,
  left_side_x,
  left_side_y
) => {
  if (i < n) {
    //Condition to Color with orange the key at the beginning of the for loop
    if (j == i - 1) {
      rectToCircleAnimation(ctx, key_x, key_y, edge, arr[i])
      ctx.strokeStyle = "#FFA500"
      circleToRectAnimation(ctx, key_x, key_y, edge, arr[i])
    }

    ctx.strokeStyle = "black"

    if (j >= 0) {
      //Change to circle next possible swap condidate
      rectToCircleAnimation(ctx, left_side_x, left_side_y, edge, arr[j])
      if (arr[j + 1] < arr[j]) {
        setTimeout(() => {
          arr = swap(arr, j, j + 1)
          console.log(arr)
          /**Testing area */
          key_x = canvas.width / 10 - edge / 2 + (j % 9) * (edge + dx)
          key_y = canvas.height / 9 - edge / 2 + Math.floor(j / 9) * (edge + dy)

          left_side_x =
            canvas.width / 10 - edge / 2 + ((j - 1) % 9) * (edge + dx)
          left_side_y =
            canvas.height / 9 - edge / 2 + Math.floor((j - 1) / 9) * (edge + dy)

          insertionSort(
            arr,
            n,
            i,
            j - 1,
            key_x,
            key_y,
            left_side_x,
            left_side_y
          )
          /**Testing area */

          /*
          insertionSort(
            arr,
            n,
            i,
            j - 1,
            key_x - (edge + dx),
            key_y,
            left_side_x - (edge + dx),
            left_side_y
          )*/
        }, 50)
      } else {
        //There are no possible swaps on the left side of the key
        setTimeout(() => {
          //Let the key + element on left of it become green rectangles
          ctx.strokeStyle = "green"
          circleToRectAnimation(ctx, key_x, key_y, edge, arr[j + 1])
          circleToRectAnimation(ctx, left_side_x, left_side_y, edge, arr[j])
          ctx.strokeStyle = "black"

          //Change the (x,y) coord for both the key & elt left of it.
          key_x = canvas.width / 10 - edge / 2 + ((i + 1) % 9) * (edge + dx)
          key_y =
            canvas.height / 9 - edge / 2 + Math.floor((i + 1) / 9) * (edge + dy)

          left_side_x = canvas.width / 10 - edge / 2 + (i % 9) * (edge + dx)
          left_side_y =
            canvas.height / 9 - edge / 2 + Math.floor(i / 9) * (edge + dy)

          insertionSort(
            arr,
            n,
            i + 1,
            i,
            key_x,
            key_y,
            left_side_x,
            left_side_y
          )
        }, 50)
      }
    } else {
      //Next iteration
      setTimeout(() => {
        //Change the (x,y) coord for both the key & elt left of it.
        key_x = canvas.width / 10 - edge / 2 + ((i + 1) % 9) * (edge + dx)
        key_y =
          canvas.height / 9 - edge / 2 + Math.floor((i + 1) / 9) * (edge + dy)

        left_side_x = canvas.width / 10 - edge / 2 + (i % 9) * (edge + dx)
        left_side_y =
          canvas.height / 9 - edge / 2 + Math.floor(i / 9) * (edge + dy)

        insertionSort(arr, n, i + 1, i, key_x, key_y, left_side_x, left_side_y)
      }, 1500)
    }
  } else {
    console.log("Array is sorted !!")
    success()
    btn1.removeAttribute("disabled")
    btn1.classList.remove("not-working")
  }
}
