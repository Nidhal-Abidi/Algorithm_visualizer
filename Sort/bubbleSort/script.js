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

    bubbleSort(
      arrInputValues,
      0,
      arrInputValues.length,
      edge,
      ctx,
      canvas,
      dx,
      dy
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
      ctx.lineWidth = 1
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
  ctx.lineWidth = 5

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
  ctx.lineWidth = 1
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

const bubbleSort = (arr, i, j) => {
  if (j > 1) {
    if (i < arr.length - 2) {
      //console.log(arr[i] + " , " + arr[i + 1])
      rectToCircleAnimation(ctx, x_axis_pos_back, y_axis_pos_back, edge, arr[i])
      rectToCircleAnimation(
        ctx,
        x_axis_pos_front,
        y_axis_pos_front,
        edge,
        arr[i + 1]
      )
      if (arr[i] > arr[i + 1]) {
        setTimeout(() => {
          console.log("swap " + arr[i] + " & " + arr[i + 1])

          let temp = arr[i]
          arr[i] = arr[i + 1]
          arr[i + 1] = temp
          //console.log(arr)
          bubbleSort(arr, i, j)
        }, 2000)
      } else {
        setTimeout(() => {
          circleToRectAnimation(
            ctx,
            x_axis_pos_back,
            y_axis_pos_back,
            edge,
            arr[i]
          )
          if (x_axis_pos_back + 2 * (edge + dx) < canvas.width) {
            //Still on the same line
            x_axis_pos_back += edge + dx
          } else {
            //Back to a new line
            x_axis_pos_back = canvas.width / 10 - edge / 2
            y_axis_pos_back += edge + dy
          }

          //Same logic for x_axis_pos_front

          if (x_axis_pos_front + 2 * (edge + dx) < canvas.width) {
            x_axis_pos_front += edge + dx
          } else {
            x_axis_pos_front = canvas.width / 10 - edge / 2
            y_axis_pos_front += edge + dy
          }

          //console.log("x: " + x_axis_pos)
          bubbleSort(arr, i + 1, j)
        }, 2000)
      }
    } else if (i == arr.length - 2) {
      rectToCircleAnimation(
        ctx,
        x_axis_pos_back,
        y_axis_pos_back,
        edge,
        arr[arr.length - 2]
      )
      rectToCircleAnimation(
        ctx,
        x_axis_pos_front,
        y_axis_pos_front,
        edge,
        arr[arr.length - 1]
      )
      if (arr[arr.length - 2] > arr[arr.length - 1]) {
        setTimeout(() => {
          console.log("swap " + arr[i] + " & " + arr[i + 1])

          let temp = arr[i]
          arr[i] = arr[i + 1]
          arr[i + 1] = temp
          console.log(arr)
          bubbleSort(arr, i + 1, j)
        }, 2000)
      } else {
        setTimeout(() => {
          bubbleSort(arr, i + 1, j)
        }, 2000)
      }
    } else {
      rectToCircleAnimation(
        ctx,
        x_axis_pos_back,
        y_axis_pos_back,
        edge,
        arr[arr.length - 2]
      )
      rectToCircleAnimation(
        ctx,
        x_axis_pos_front,
        y_axis_pos_front,
        edge,
        arr[arr.length - 1]
      )

      setTimeout(() => {
        circleToRectAnimation(
          ctx,
          x_axis_pos_back,
          y_axis_pos_back,
          edge,
          arr[arr.length - 2]
        )
        circleToRectAnimation(
          ctx,
          x_axis_pos_front,
          y_axis_pos_front,
          edge,
          arr[arr.length - 1]
        )
        /*Get back to the beginning of the array to do another iteration +
      check whether or not there are more swaps to be done */
        x_axis_pos_back = canvas.width / 10 - edge / 2
        y_axis_pos_back = canvas.height / 9 - edge / 2

        x_axis_pos_front = canvas.width / 10 - edge / 2 + (edge + dx)
        y_axis_pos_front = canvas.height / 9 - edge / 2
        bubbleSort(arr, 0, j - 1)
      }, 2000)
    }
  } else {
    success()
    btn1.removeAttribute("disabled")
    btn1.classList.remove("not-working")
    console.log("Congrats: The array is Sorted")
  }
}
