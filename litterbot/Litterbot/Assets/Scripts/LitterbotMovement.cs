using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class LitterbotMovement : MonoBehaviour {
    Rigidbody bot;
    Vector3 vel;
    float rotY;
    float rotZ;

    int counter = 0;
    int loops = 0;

    // Start is called before the first frame update
    void Start() {
        bot = GetComponent<Rigidbody>();
        vel = new Vector3(0, 0, 0.25f);
        rotY = bot.transform.eulerAngles.y;
        rotZ = bot.transform.eulerAngles.z;
    }

    // Update is called once per frame

    // TODO use delta time
    void Update() {
        counter++;

        bot.transform.eulerAngles = new Vector3(
            bot.transform.eulerAngles.x,
            rotY,
            rotZ
        );

        if (counter >= 10) {
            bot.velocity = vel;
            counter = 0;
            loops++;
        }

        if (loops >= 340) {
            vel = new Vector3(0.25f, 0, 0);
            rotZ += 90;
            loops = 0;
        }

        Debug.Log(loops);
    }

    void Turn(bool rightOrLeft) {

    }

    void Turn(float angX, float angY, float angZ) {

    }
}