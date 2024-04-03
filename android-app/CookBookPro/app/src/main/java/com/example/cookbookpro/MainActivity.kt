package com.example.cookbookpro

import android.content.ContentValues.TAG
import android.content.Intent
import android.content.IntentSender
import android.content.res.Resources
import android.os.Bundle
import android.util.Log
import com.google.android.material.bottomnavigation.BottomNavigationView
import androidx.appcompat.app.AppCompatActivity
import androidx.navigation.findNavController
import androidx.navigation.ui.AppBarConfiguration
import androidx.navigation.ui.setupWithNavController
import com.example.cookbookpro.databinding.ActivityMainBinding
import com.example.cookbookpro.signin.GoogleAuthUiClient
import com.google.android.gms.auth.api.identity.BeginSignInRequest
import com.google.android.gms.auth.api.identity.Identity
import com.google.android.gms.auth.api.identity.SignInClient
import com.google.firebase.Firebase
import com.google.firebase.auth.FirebaseAuth
import com.google.firebase.auth.FirebaseUser
import com.google.firebase.auth.auth
import com.google.firebase.initialize
import androidx.lifecycle.ViewModelProvider
import com.example.cookbookpro.signin.SignInViewModel

class MainActivity : AppCompatActivity() {
    //git commit test
    private lateinit var binding: ActivityMainBinding
    private lateinit var auth: FirebaseAuth
    private lateinit var oneTapClient: SignInClient
    private lateinit var signInRequest: BeginSignInRequest
    private val REQ_ONE_TAP = 2  // Can be any integer unique to the Activity
    private var showOneTapUI = true

    private val googleAuthUiClient by lazy {
        GoogleAuthUiClient(
            context = applicationContext,
            oneTapClient = Identity.getSignInClient(applicationContext)
        )
    }

/*    @Composable
    private fun MainContent(
        navController: NavHostController,
        googleAuthUiClient: GoogleAuthUiClient,
        viewModel: SignInViewModel
    ) {
        // Copy and paste the code you provided here
        // Make sure to replace any references to `viewModel` with the `viewModel` parameter
        // Replace `rememberNavController()` with the `navController` parameter
        // Replace `googleAuthUiClient` with the parameter as well
        val navController = navController
        NavHost(navController = navController, startDestination = "sign_in") {
            composable("sign_in") {
                val viewModel = viewModel<SignInViewModel>()
                val state by viewModel.state.collectAsStateWithLifecycle()

                LaunchedEffect(key1 = Unit) {
                    if(googleAuthUiClient.getSignedInUser() != null) {
                        navController.navigate("profile")
                    }
                }

                val launcher = rememberLauncherForActivityResult(
                    contract = ActivityResultContracts.StartIntentSenderForResult(),
                    onResult = { result ->
                        if(result.resultCode == RESULT_OK) {
                            lifecycleScope.launch {
                                val signInResult = googleAuthUiClient.signInWithIntent(
                                    intent = result.data ?: return@launch
                                )
                                viewModel.onSignInResult(signInResult)
                            }
                        }
                    }
                )

                LaunchedEffect(key1 = state.isSignInSuccessful) {
                    if(state.isSignInSuccessful) {
                        Toast.makeText(
                            applicationContext,
                            "Sign in successful",
                            Toast.LENGTH_LONG
                        ).show()

                        navController.navigate("navigation_profile")
                        viewModel.resetState()
                    }
                }

                SignInScreen(
                    state = state,
                    onSignInClick = {
                        lifecycleScope.launch {
                            val signInIntentSender = googleAuthUiClient.signIn()
                            launcher.launch(
                                IntentSenderRequest.Builder(
                                    signInIntentSender ?: return@launch
                                ).build()
                            )
                        }
                    }
                )
            }
        }
    }*/
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityMainBinding.inflate(layoutInflater)
        setContentView(binding.root)
//      val viewModel = ViewModelProvider(this)[SignInViewModel::class.java]

        val navView: BottomNavigationView = binding.navView
        val navController = findNavController(R.id.nav_host_fragment_activity_main)
        navView.setupWithNavController(navController)

        // Initialize Firebase Auth
        Firebase.initialize(this)
        auth = Firebase.auth
        val authStateListener = FirebaseAuth.AuthStateListener { auth ->
            val user = auth.currentUser
            if (user != null) {
                // User is signed in update Navigation
                println("USER IS SIGNED IN ALREADY")
                navController.navigate(R.id.navigation_home)
            } else {
                // User is signed out update Navigation
                navController.navigate(R.id.navigation_sign_in)
            }
        }
    // Add the AuthStateListener
    auth.addAuthStateListener(authStateListener)
    }
    //val navController = findNavController(R.id.nav_host_fragment_activity_main)
    private fun reload(user: FirebaseUser?) {
    }
}