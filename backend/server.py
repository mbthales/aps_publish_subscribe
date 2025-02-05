import random
import time
import threading
from flask import Flask
from flask_socketio import SocketIO
from abc import ABC, abstractmethod
import numpy as np

app = Flask(__name__)
socketio = SocketIO(app, cors_allowed_origins="*")

class Observer(ABC):
    @abstractmethod
    def update(self, type, patient, data, priority):
        pass

class SimulationStrategy(ABC):
    @abstractmethod
    def simulate(self):
        pass

class ChainOfResponsibilityHandler(ABC):
    def __init__(self, successor=None):
        self._successor = successor

    @abstractmethod
    def handle_request(self, doctor, patient, data, type):
        raise NotImplementedError("You should implement this method")
    
    @abstractmethod
    def can_handle_request(self, type, data):
        raise NotImplementedError("You should implement this method")

class HeartbeatSimulation(SimulationStrategy):
    def simulate(self):
        return int(np.random.normal(80, 15))

class OxygenSimulation(SimulationStrategy):
    def simulate(self):
        return int(np.random.normal(96, 4))

class PressureSimulation(SimulationStrategy):
    def simulate(self):
        return int(np.random.normal(120, 6))

class HighPriority(ChainOfResponsibilityHandler):
    def handle_request(self, data, type):
        if self.can_handle_request(type, data):
            return "high"
        elif self._successor:
            return self._successor.handle_request(data, type)

    def can_handle_request(self, type, data):
        if type == 'heartbeat' and data > 100:
            return True
        elif type == 'oxygen' and data < 92:
            return True
        elif type == 'pressure' and data > 130:
            return True
        return False

class LowPriority(ChainOfResponsibilityHandler):
    def handle_request(self, data, type):
        if self.can_handle_request(type, data):
            return "low"
        elif self._successor:
            return self._successor.handle_request(data, type)

    def can_handle_request(self, type, data):
        if type == 'heartbeat' and data < 100:
            return True
        elif type == 'oxygen' and data > 92:
            return True
        elif type == 'pressure' and data < 130:
            return True
        return False

class Patient:
    def __init__(self, name):
        self._name = name
        self._doctors = []
        self._strategies = {}

    def set_strategy(self, type, strategy):
        self._strategies[type] = strategy

    def add_doctor(self, doctor):
        self._doctors.append(doctor)

    def remove_doctor(self, doctor):
        self._doctors.remove(doctor)

    def notify_doctors(self):
        chain = HighPriority(LowPriority())

        while True:
            for doctor in self._doctors:
                for type, strategy in self._strategies.items():
                    data = strategy.simulate()
                    priority = chain.handle_request(data, type)
                    doctor.update(type, self._name, data, priority)
                    
            time.sleep(2)

class Doctor(Observer):
    def __init__(self, socket):
        self.socket = socket

    def update(self, type, patient, data, priority):
        self.socket.emit(type, {'patient': patient, 'data': data, 'priority': priority})

@socketio.on('connect')
def handle_connect():
    doctor = Doctor(socketio)
    patient_names = ["joao", "maria", "roberto", "giovana"]

    default_strategies = {
        'heartbeat': HeartbeatSimulation(),
        'oxygen': OxygenSimulation(),
        'pressure': PressureSimulation()
    }
    
    patients = []

    for name in patient_names:
        patient = Patient(name)
        
        for sensor_type, strategy in default_strategies.items():
            patient.set_strategy(sensor_type, strategy)

        patient.add_doctor(doctor)
        patients.append(patient)

    for patient in patients:
        threading.Thread(target=patient.notify_doctors, daemon=True).start()

if __name__ == '__main__':
    socketio.run(app)