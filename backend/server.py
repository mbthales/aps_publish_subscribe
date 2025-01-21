import random
import time
import threading
from flask import Flask
from flask_socketio import SocketIO
from abc import ABC, abstractmethod

app = Flask(__name__)
socketio = SocketIO(app, cors_allowed_origins="*")

class Observer(ABC):
    @abstractmethod
    def update(self, type, pacient, data):
        pass

class SimulationStrategy(ABC):
    @abstractmethod
    def simulate(self, multiply_test):
        pass

class HeartbeatSimulation(SimulationStrategy):
    def simulate(self, multiply_test):
        return random.randint(60 * multiply_test, 100 * multiply_test)

class OxygenSimulation(SimulationStrategy):
    def simulate(self, multiply_test):
        return random.randint(90 * multiply_test, 100 * multiply_test)

class PressureSimulation(SimulationStrategy):
    def simulate(self, multiply_test):
        return random.randint(80 * multiply_test, 120 * multiply_test)

class Pacient:
    def __init__(self, name, multiply_test=1):
        self._name = name
        self._multiply_test = multiply_test
        self._doctors = []
        self._strategies = {
            'heartbeat': HeartbeatSimulation(),
            'oxygen': OxygenSimulation(),
            'pressure': PressureSimulation()
        }

    def add_doctor(self, doctor):
        self._doctors.append(doctor)

    def remove_doctor(self, doctor):
        self._doctors.remove(doctor)

    def notify_doctors(self):
        while True:
            for doctor in self._doctors:
                for type, strategy in self._strategies.items():
                    data = strategy.simulate(self._multiply_test)
                    doctor.update(type, self._name, data)
            time.sleep(5)

class Doctor(Observer):
    def __init__(self, socket):
        self.socket = socket

    def update(self, type, pacient, data):
        self.socket.emit(type, {'pacient': pacient, 'data': data})

@socketio.on('connect')
def handle_connect():
    pacient = Pacient("joao")
    pacient2 = Pacient("maria", 5)

    doctor = Doctor(socketio)

    pacient.add_doctor(doctor)
    pacient2.add_doctor(doctor)

    threading.Thread(target=pacient.notify_doctors, daemon=True).start()
    threading.Thread(target=pacient2.notify_doctors, daemon=True).start()

if __name__ == '__main__':
    socketio.run(app)