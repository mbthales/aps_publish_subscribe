import time
import threading
from flask import Flask
import numpy as np
from flask_socketio import SocketIO
from abc import ABC, abstractmethod

app = Flask(__name__)
socketio = SocketIO(app, cors_allowed_origins="*")

class Observer(ABC):
    @abstractmethod
    def update(self, type, patient, data, priority):
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

class SimulationStrategy(ABC):
    @abstractmethod
    def simulate(self):
        pass

class ContextStrategy:
    def __init__(self, strategy: SimulationStrategy):
        self._strategy = strategy

    def run_simulation(self):
        return self._strategy.simulate()  
    
class HeartbeatSimulation(SimulationStrategy):
    def simulate(self):
        return int(np.random.normal(80, 10))

class OxygenSimulation(SimulationStrategy):
    def simulate(self):
        return int(np.random.normal(96, 2))

class PressureSimulation(SimulationStrategy):
    def simulate(self):
        return int(np.random.normal(120, 4))

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
        if type == 'heartbeat' and data <= 100:
            return True
        elif type == 'oxygen' and data >= 92:
            return True
        elif type == 'pressure' and data <= 130:
            return True
        return False

class Patient:
    def __init__(self, name):
        self._name = name
        self._doctors = []
        self._sensors = {}

    def add_sensor(self, type, sensor):
        if type not in self._sensors:
            self._sensors[type] = ContextStrategy(sensor)
        else:
            raise ValueError("Sensor already added")

    def add_doctor(self, doctor):
        if doctor not in self._doctors:
            self._doctors.append(doctor)
        else:
            raise ValueError("Doctor already added")

    def remove_doctor(self, doctor):
        if doctor in self._doctors:
            self._doctors.remove(doctor)
        else:
            raise ValueError("Doctor not found")

    def notify_doctors(self):
        chain = HighPriority(LowPriority())

        while True:
            for doctor in self._doctors:
                for type, sensor in self._sensors.items():
                    data = sensor.run_simulation()
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

    default_sensors = {
        'heartbeat': HeartbeatSimulation(),
        'oxygen': OxygenSimulation(),
        'pressure': PressureSimulation()
    }
    
    patients = []

    for name in patient_names:
        patient = Patient(name)
        
        for sensor_type, strategy in default_sensors.items():
            patient.add_sensor(sensor_type, strategy)

        patient.add_doctor(doctor)
        patients.append(patient)

    for patient in patients:
        threading.Thread(target=patient.notify_doctors, daemon=True).start()

if __name__ == '__main__':
    socketio.run(app)