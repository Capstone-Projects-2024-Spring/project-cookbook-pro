package com.example.cookbookpro.ui.fragmentContainers.home

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Button
import androidx.fragment.app.Fragment
import com.example.cookbookpro.R
import com.example.cookbookpro.databinding.FragmentHomeBinding
import com.example.cookbookpro.signin.GoogleAuthUiClient
import com.google.android.gms.auth.api.identity.Identity
import com.google.firebase.auth.FirebaseAuth
import com.google.firebase.database.FirebaseDatabase

class HomeFragment : Fragment() {

    private var _binding: FragmentHomeBinding? = null
    private val binding get() = _binding!!
    private lateinit var googleAuthUiClient: GoogleAuthUiClient

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        _binding = FragmentHomeBinding.inflate(inflater, container, false)
        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        googleAuthUiClient = GoogleAuthUiClient(
            context = requireContext(),
            oneTapClient = Identity.getSignInClient(requireContext())
        )
        val buttonSignOut: Button = view.findViewById(R.id.signOutButton)
        buttonSignOut.setOnClickListener{
            googleAuthUiClient.signOut()
        }

        val databaseReference = FirebaseDatabase.getInstance().reference
        val uid = FirebaseAuth.getInstance().currentUser?.uid
        println("UID: ${uid}")
        uid?.let {
            println("INFO")
            println(databaseReference.child("Users").child(uid))
            println("INFO")
            val userRef = databaseReference.child("Users").child(uid).child("SavedRecipes")
            println("DATA")
            println(userRef.get())
            println("DATA")
            // Example: Read the user's data
            userRef.get().addOnSuccessListener { dataSnapshot ->
                if (dataSnapshot.exists()) {
                    // Assuming you have a User class to map the data.
                    println(dataSnapshot)
                    // Do something with userData
                } else {
                    // Handle the case where the data does not exist.
                    println("CANNOT FIND DATA")
                }
            }.addOnFailureListener {
                // Handle any errors.
            }
        }

    }

    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }
}