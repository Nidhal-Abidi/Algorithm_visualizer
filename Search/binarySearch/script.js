hljs.highlightAll()

const btn1 = document.querySelector(".btn1")
//const btn2 = document.querySelector(".btn2")
const form = document.querySelector("form")
const animationRslt = document.querySelector(".animation-result")
const arrInput = document.querySelector("#arr-input")
const key = document.querySelector("#search-key")

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

/** Input validation */
form.addEventListener("submit", (e) => {
  e.preventDefault()
  let errorMsgs = []
  let arrInputValues = [] //So that I can pass it to method "linearSearch"

  if (key.value === "" || key.value == null) {
    errorMsgs.push("Key value shouldn't be empty")
  }
  if (key.value.match(/[^0-9]+/)) {
    errorMsgs.push("Key value shouldn't contain more than 1 NUMERIC value")
  }

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
    binarySearch(
      arrInputValues,
      key.value,
      edge,
      ctx,
      canvas,
      dx,
      dy,
      0,
      arrInputValues.length - 1
    )
  }
})

/* 
//fct to test switching on/off the buttons
btn2.addEventListener("click", (e) => {
  if (btn2.classList.contains("not-working")) {
    btn2.classList.remove("not-working")
  } else {
    btn2.classList.add("not-working")
  }
})
*/

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
  ctx.clearRect(x_axis_pos - 0.5, y_axis_pos - 0.5, edge + 5, edge + 5)
  ctx.fillText(nbr, x_axis_pos + edge / 2, y_axis_pos + edge / 2)

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
  console.log("Congrats We Found The Key !!")
  animationRslt.innerText = "Congrats We Found The Key :)"
  animationRslt.style.backgroundColor = "green"
  animationRslt.style.fontSize = "30px"
}

const failure = () => {
  console.log("Unfortunately We Couldn't Find The Key !!")
  animationRslt.innerText = "Unfortunately We Couldn't Find The Key !!"
  animationRslt.style.backgroundColor = "red"
  animationRslt.style.fontSize = "30px"
}

const binarySearch = (arrNbrs, key, edge, ctx, canvas, dx, dy, low, high) => {
  if (low > high) {
    failure()
    btn1.removeAttribute("disabled")
    btn1.classList.remove("not-working")
    console.log(btn1)
    return -1
  } else {
    let mid = parseInt((low + high) / 2)
    let x_axis_pos = canvas.width / 10 - edge / 2 + (mid % 9) * (edge + dx)
    let y_axis_pos =
      canvas.height / 9 - edge / 2 + Math.floor(mid / 9) * (edge + dy)
    /*
    console.log("mid : " + mid)
    console.log("x_axis_pos : " + x_axis_pos)
    console.log("y_axis_pos : " + y_axis_pos)
    */
    rectToCircleAnimation(ctx, x_axis_pos, y_axis_pos, edge, arrNbrs[mid])
    if (arrNbrs[mid] == parseInt(key)) {
      success()
      btn1.removeAttribute("disabled")
      btn1.classList.remove("not-working")
      console.log(btn1)
      return mid
    } else if (arrNbrs[mid] < parseInt(key)) {
      console.log(arrNbrs[mid] + "<" + parseInt(key))
      setTimeout(() => {
        circleToRectAnimation(ctx, x_axis_pos, y_axis_pos, edge, arrNbrs[mid])
        binarySearch(arrNbrs, key, edge, ctx, canvas, dx, dy, mid + 1, high)
      }, 1700)
    } else {
      setTimeout(() => {
        circleToRectAnimation(ctx, x_axis_pos, y_axis_pos, edge, arrNbrs[mid])
        binarySearch(arrNbrs, key, edge, ctx, canvas, dx, dy, low, mid - 1)
      }, 1700)
    }
  }
}
