#!/usr/bin/env python
"""
Helper script to run Django server on port 8000
"""
import os
import sys
import subprocess
import signal
import time

# Port to use
PORT = 8000

def find_process_on_port(port):
    """Find process using the specified port"""
    try:
        # This works on macOS and Linux
        lsof_output = subprocess.check_output(
            ["lsof", "-i", f":{port}"], 
            stderr=subprocess.STDOUT,
            text=True
        )
        
        # Parse the output to get the PID
        lines = lsof_output.strip().split('\n')
        if len(lines) > 1:  # Skip header
            process_info = lines[1].split()
            if len(process_info) > 1:
                return int(process_info[1])  # PID is in the second column
    except (subprocess.CalledProcessError, ValueError, IndexError):
        # No process found or error in parsing
        pass
    
    return None

def kill_process_on_port(port):
    """Kill process using the specified port"""
    pid = find_process_on_port(port)
    if pid:
        print(f"Found process with PID {pid} using port {port}. Attempting to terminate...")
        try:
            os.kill(pid, signal.SIGTERM)
            time.sleep(1)  # Give it a moment to terminate
            
            # Check if it's still running
            if find_process_on_port(port):
                os.kill(pid, signal.SIGKILL)  # Force kill if still running
                print(f"Process {pid} forcefully terminated.")
            else:
                print(f"Process {pid} terminated.")
            
            return True
        except OSError as e:
            print(f"Error killing process: {e}")
    
    return False

def run_django_server():
    """Run Django development server with the specified port"""
    # First, check if port is in use
    if find_process_on_port(PORT):
        print(f"Port {PORT} is already in use.")
        choice = input(f"Do you want to free up port {PORT}? (y/n): ")
        
        if choice.lower() == 'y':
            if not kill_process_on_port(PORT):
                print(f"Failed to free up port {PORT}. Please close the application using this port manually.")
                return False
        else:
            print("Exiting without starting server.")
            return False
    
    print(f"Starting Django server on port {PORT}...")
    
    # Build the command
    command = ["python", "manage.py", "runserver", f"0.0.0.0:{PORT}"]
    
    try:
        # Run the server
        subprocess.run(command)
        return True
    except KeyboardInterrupt:
        print("\nServer stopped.")
    except Exception as e:
        print(f"Error starting server: {e}")
    
    return False

if __name__ == "__main__":
    run_django_server() 