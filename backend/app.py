from flask import Flask, request, jsonify
from flask_cors import CORS
from views import predict_new

app = Flask(__name__)
CORS(app)

@app.route("/predict", methods=["POST"])
def predict():
    """ SENT DATA SHOULD BE
        {
        "Hour": 12,
        "Temperature": 23.5,
        "Machine_Status": "Idle"
        }
    """
    new_data = request.get_json()

    new_predicted = predict_new(new_data)
    
    if not new_predicted:
        return jsonify({"predicted": 0, "cost": 0, "message": "Predicted Successful!"})

    return new_predicted

if __name__ == "__main__":
    app.run()