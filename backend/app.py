from flask import Flask, request, jsonify
from flask_cors import CORS
from views import predict_new

app = Flask(__name__)
CORS(app)

@app.route("/predict", methods=["POST"])
def predict():
    new_data = request.get_json()

    new_predicted = predict_new(new_data)
    
    if not new_predicted:
        return jsonify({"data": None, "message": "Prediction Failed!"})

    return jsonify({"data": new_predicted, "message": "Prediction Success!"})