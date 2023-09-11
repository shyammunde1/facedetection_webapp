import "./App.css";
import Navigation from "./component/navigation/navigation.component";
import Logo from "./component/logo/logo.component";
import Rank from "./component/rank/rank.component.jsx";
import ImageLinkForm from "./component/imageLink/ImageLinkForm.component";
// import ParticleBackground from "./component/background/background.component";
import { Component } from "react";
import FaceRecognition from "./component/faceRecognation/faceRecognation.component";
import Signin from "./component/signin/signin.component";
import Register from "./component/register/register.component";
import ParticlesBg from "particles-bg";

// const MODELID = "face-detection";

// const returnClarifaiReqOption = (imageUrl) => {
//   // Your PAT (Personal Access Token) can be found in the portal under Authentification
//   const PAT = "4a57f03778f64ce3bdbd7c10f6001821";
//   // Specify the correct user_id/app_id pairings
//   // Since you're making inferences outside your app's scope
//   const USER_ID = "samtech1991";
//   const APP_ID = "test";
//   // Change these to whatever model and image URL you want to use
//   // const MODEL_ID = "face-detection";
//   // const MODEL_VERSION_ID = "aa7f35c01e0642fda5cf400f543e7c40";
//   const IMAGE_URL = imageUrl;

//   const raw = JSON.stringify({
//     user_app_id: {
//       user_id: USER_ID,
//       app_id: APP_ID,
//     },
//     inputs: [
//       {
//         data: {
//           image: {
//             url: IMAGE_URL,
//           },
//         },
//       },
//     ],
//   });

//   const requestOptions = {
//     method: "POST",
//     headers: {
//       Accept: "application/json",
//       Authorization: "Key " + PAT,
//     },
//     body: raw,
//   };

//   return requestOptions;
// };

const initialState = {
  input: "",
  imageUrl: "",
  box: {},
  route: "signin",
  isSignedIn: false,
  user: {
    id: "",
    name: "",
    email: "",
    entries: 0,
    joined: "",
  },
};

class App extends Component {
  constructor() {
    super();
    this.state = initialState;
  }

  loadUser = (data) => {
    this.setState({
      user: {
        id: data.id,
        name: data.name,
        email: data.email,
        entries: data.entries,
        joined: data.joined,
      },
    });
  };

  calculateFaceLocation = (data) => {
    const clarifaiFace =
      data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById("inputimage");
    const width = Number(image.width);
    const height = Number(image.height);
    return {
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - clarifaiFace.right_col * width,
      bottomRow: height - clarifaiFace.bottom_row * height,
    };
  };

  displayFaceBox = (box) => {
    this.setState({ box: box });
  };

  onInputChange = (event) => {
    // console.log(event.target.value);
    this.setState({ input: event.target.value });
  };

  onSubmitButton = () => {
    this.setState({ imageUrl: this.state.input });

    // HEADS UP! Sometimes the Clarifai Models can be down or not working as they are constantly getting updated.
    // A good way to check if the model you are using is up, is to check them on the clarifai website. For example,
    // for the Face Detect Mode: https://www.clarifai.com/models/face-detection
    // If that isn't working, then that means you will have to wait until their servers are back up.

    fetch("https://facedetection-api.onrender.com/imageurl", {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        input: this.state.input,
      }),
    })
      .then((response) => response.json())
      .then((response) => {
        console.log("hi", response);
        if (response) {
          fetch("https://facedetection-api.onrender.com/image", {
            method: "put",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              id: this.state.user.id,
            }),
          })
            .then((response) => response.json())
            .then((count) => {
              this.setState(Object.assign(this.state.user, { entries: count }));
            })
            .catch(console.log);
        }
        this.displayFaceBox(this.calculateFaceLocation(response));
      })
      .catch((err) => console.log(err));
  };

  onRouteChange = (route) => {
    if (route === "signout") {
      this.setState(initialState);
    } else if (route === "home") {
      this.setState({ isSignedIn: true });
    }
    this.setState({ route: route });
  };

  render() {
    const { isSignedIn, imageUrl, route, box } = this.state;

    return (
      <div className="App">
        <ParticlesBg color="#f1eaea" num={100} type="cobweb" bg={true} />
        <Navigation
          isSignedIn={isSignedIn}
          onRouteChange={this.onRouteChange}
        />
        {route === "home" ? (
          <div>
            <Logo />
            <Rank
              name={this.state.user.name}
              entries={this.state.user.entries}
            />
            <ImageLinkForm
              onInputChange={this.onInputChange}
              onButtonSubmit={this.onSubmitButton}
            />
            <FaceRecognition box={box} imageUrl={imageUrl} />
          </div>
        ) : route === "signin" ? (
          <Signin loadUser={this.loadUser} onRouteChange={this.onRouteChange} />
        ) : (
          <Register
            loadUser={this.loadUser}
            onRouteChange={this.onRouteChange}
          />
        )}
      </div>
    );
  }
}

export default App;
